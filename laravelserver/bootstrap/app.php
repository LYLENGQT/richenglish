<?php

use App\Http\Middleware\AttachTokenFromCookie;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->api(prepend: [
            \App\Http\Middleware\HandleCors::class,
        ]);
        
        // Add session middleware for API routes to allow Sanctum to use web session
        // This is safe because we're using same-origin requests (Inertia)
        $middleware->api(append: [
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            AttachTokenFromCookie::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);

        // Configure CORS for API routes
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle authentication exceptions - redirect to login for web requests
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $exception, \Illuminate\Http\Request $request) {
            if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
                // For API requests, return JSON response
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json(['message' => 'Unauthenticated.'], 401);
                }
                
                // For web/Inertia requests, redirect to login page
                return redirect()->guest(route('login'));
            }
            
            return $response;
        });
    })->create();
