<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\TokenCookieFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        protected TokenCookieFactory $tokens
    ) {
    }

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        /** @var \App\Models\User $user */
        $user = $request->user();
        $remember = $request->boolean('remember');

        $access = $this->tokens->issue($user, 'access-token', now()->addDay());
        
        // Redirect based on user role
        $redirectRoute = match ($user->role) {
            'teacher' => route('dashboard', absolute: false),
            'admin' => route('dashboard', absolute: false),
            'super-admin' => route('dashboard', absolute: false),
            default => route('dashboard', absolute: false),
        };
        
        $response = redirect()->intended($redirectRoute);
        $response->headers->setCookie($access['cookie']);

        if ($remember) {
            $refresh = $this->tokens->issue($user, 'refresh-token', now()->addDays(30));
            $response->headers->setCookie($refresh['cookie']);
        }

        return $response;
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $this->tokens->revoke($request->cookie('token'));
        $this->tokens->revoke($request->cookie('refresh'));

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        $response = redirect('/');
        $response->headers->setCookie($this->tokens->forget('token'));
        $response->headers->setCookie($this->tokens->forget('refresh'));

        return $response;
    }
}
