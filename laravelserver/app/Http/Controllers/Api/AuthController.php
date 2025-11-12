<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TokenCookieFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        protected TokenCookieFactory $tokens
    ) {
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        /** @var User|null $user */
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        if ($user->role === 'teacher' && ! $user->accepted) {
            throw ValidationException::withMessages([
                'email' => __('Teacher account not yet approved.'),
            ]);
        }

        $remember = (bool) ($data['remember'] ?? false);

        $accessToken = $this->tokens->issue($user, 'access-token', now()->addDay());
        $response = response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'token' => $accessToken['plain'],
        ]);
        $response->headers->setCookie($accessToken['cookie']);

        if ($remember) {
            $refreshToken = $this->tokens->issue($user, 'refresh-token', now()->addDays(30));
            $response->headers->setCookie($refreshToken['cookie']);
        }

        return $response;
    }

    public function logout(Request $request): JsonResponse
    {
        if ($request->user()) {
            optional($request->user()->currentAccessToken())->delete();
        }

        $this->revokeTokenFromCookie($request->cookie('token'));
        $this->revokeTokenFromCookie($request->cookie('refresh'));

        $response = response()->json([
            'success' => true,
            'message' => 'Logged out and tokens expired',
        ]);

        $response->headers->setCookie($this->tokens->forget('token'));
        $response->headers->setCookie($this->tokens->forget('refresh'));

        return $response;
    }

    public function refresh(Request $request): JsonResponse
    {
        $refreshValue = $request->cookie('refresh');

        if (! $refreshValue) {
            return response()->json(['message' => 'Invalid'], Response::HTTP_BAD_REQUEST);
        }

        $refreshToken = PersonalAccessToken::findToken($refreshValue);

        if (! $refreshToken || $refreshToken->name !== 'refresh-token') {
            return response()->json(['message' => 'Invalid'], Response::HTTP_BAD_REQUEST);
        }

        if ($refreshToken->expires_at && $refreshToken->expires_at->isPast()) {
            $refreshToken->delete();

            return response()->json(['message' => 'Refresh token expired'], Response::HTTP_BAD_REQUEST);
        }

        /** @var User $user */
        $user = $refreshToken->tokenable;

        $accessToken = $this->tokens->issue($user, 'access-token', now()->addDay());

        $response = response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'token' => $accessToken['plain'],
        ]);

        $response->headers->setCookie($accessToken['cookie']);

        return $response;
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email']]);

        /** @var User|null $user */
        $user = User::where('email', $data['email'])->first();

        if (! $user) {
            return response()->json(['message' => 'Invalid'], Response::HTTP_BAD_REQUEST);
        }

        $otp = (string) random_int(100000, 999999);
        $user->forceFill([
            'reset_otp' => $otp,
            'reset_expires_at' => now()->addMinutes(10),
        ])->save();

        Mail::raw("Your RichEnglish password reset OTP is {$otp}", function ($message) use ($user) {
            $message->to($user->email)->subject('Password Reset OTP');
        });

        return response()->json(['message' => 'email sent']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'newPassword' => ['required', 'string', 'min:8'],
            'confirmPassword' => ['required', 'string', 'same:newPassword'],
        ]);

        // Try to get user from authenticated session first (if OTP was verified)
        /** @var User|null $user */
        $user = $request->user();

        // If not authenticated, try to find user by email and check if they have a valid OTP session
        if (! $user) {
            $user = User::where('email', $data['email'])->first();
            
            if (! $user) {
                return response()->json(['message' => 'Invalid email'], Response::HTTP_BAD_REQUEST);
            }

            // Check if user has a valid OTP session (recently verified OTP)
            // We'll check if they have an active access token from OTP verification
            // Or we can use a session-based approach
            // For now, we'll allow reset if they have a valid token in cookie
            $tokenValue = $request->cookie('token');
            if ($tokenValue) {
                $token = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenValue);
                if ($token && $token->tokenable_id === $user->id && $token->name === 'access-token') {
                    // Valid token from OTP verification
                } else {
                    return response()->json(['message' => 'Please verify OTP first'], Response::HTTP_UNAUTHORIZED);
                }
            } else {
                return response()->json(['message' => 'Please verify OTP first'], Response::HTTP_UNAUTHORIZED);
            }
        }

        $user->forceFill([
            'password' => Hash::make($data['newPassword']),
            'reset_otp' => null,
            'reset_expires_at' => null,
        ])->save();

        // Revoke the temporary access token used for password reset
        if ($request->cookie('token')) {
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($request->cookie('token'));
            if ($token && $token->name === 'access-token') {
                $token->delete();
            }
        }

        $response = response()->json(['message' => 'Password reset successfully']);
        $response->headers->setCookie($this->tokens->forget('token'));

        return $response;
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $data = $request->validate(['otp' => ['required', 'string']]);

        /** @var User|null $user */
        $user = User::where('reset_otp', $data['otp'])->first();

        if (! $user) {
            return response()->json(['message' => 'Invalid'], Response::HTTP_BAD_REQUEST);
        }

        if (! $user->reset_expires_at || $user->reset_expires_at->isPast()) {
            return response()->json(['message' => 'OTP expired'], Response::HTTP_BAD_REQUEST);
        }

        $accessToken = $this->tokens->issue($user, 'access-token', now()->addDay());

        $user->forceFill([
            'reset_otp' => null,
            'reset_expires_at' => null,
        ])->save();

        $response = response()->json(['message' => 'Valid OTP', 'token' => $accessToken['plain']]);
        $response->headers->setCookie($accessToken['cookie']);

        return $response;
    }

    public function resendOtp(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email']]);

        /** @var User|null $user */
        $user = User::where('email', $data['email'])->first();

        if (! $user) {
            return response()->json(['message' => 'Invalid'], Response::HTTP_BAD_REQUEST);
        }

        $otp = (string) random_int(100000, 999999);
        $user->forceFill([
            'reset_otp' => $otp,
            'reset_expires_at' => now()->addMinutes(10),
        ])->save();

        Mail::raw("Your RichEnglish password reset OTP is {$otp}", function ($message) use ($user) {
            $message->to($user->email)->subject('Password Reset OTP');
        });

        return response()->json(['message' => 'email sent']);
    }

    protected function revokeTokenFromCookie(?string $value): void
    {
        $this->tokens->revoke($value);
    }

}
