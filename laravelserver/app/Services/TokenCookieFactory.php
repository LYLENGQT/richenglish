<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Cookie;

class TokenCookieFactory
{
    /**
     * Issue a Sanctum token and corresponding HTTP-only cookie.
     *
     * @return array{plain: string, cookie: Cookie}
     */
    public function issue(User $user, string $name, Carbon $expiresAt): array
    {
        $token = $user->createToken($name, abilities: ['*'], expiresAt: $expiresAt);

        $plainText = $token->plainTextToken;
        $minutes = now()->diffInMinutes($expiresAt, false);
        $minutes = $minutes > 0 ? $minutes : 60;

        $cookieName = $name === 'refresh-token' ? 'refresh' : 'token';

        $cookie = cookie(
            $cookieName,
            $plainText,
            $minutes,
            '/',
            Config::get('session.domain'),
            $this->shouldUseSecureCookies(),
            true,
            false,
            $this->sameSite()
        );

        return ['plain' => $plainText, 'cookie' => $cookie];
    }

    public function revoke(?string $value): void
    {
        if (! $value) {
            return;
        }

        $token = PersonalAccessToken::findToken($value);
        $token?->delete();
    }

    public function forget(string $name): Cookie
    {
        return cookie(
            $name,
            '',
            -1,
            '/',
            Config::get('session.domain'),
            $this->shouldUseSecureCookies(),
            true,
            false,
            $this->sameSite()
        );
    }

    protected function shouldUseSecureCookies(): bool
    {
        return Config::get('app.env') === 'production';
    }

    protected function sameSite(): string
    {
        return $this->shouldUseSecureCookies() ? 'none' : 'lax';
    }
}

