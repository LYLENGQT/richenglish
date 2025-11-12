<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AttachTokenFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // For same-origin requests (Inertia), Sanctum will check web session first
        // (configured in sanctum.php with 'guard' => ['web'])
        // The session middleware runs before this, so Sanctum can authenticate via web session
        // Only attach token from cookie as fallback if no bearer token is present
        if (! $request->bearerToken()) {
            $token = $request->cookie('token');

            if ($token) {
                $request->headers->set('Authorization', 'Bearer '.$token);
            }
        }

        return $next($request);
    }
}
