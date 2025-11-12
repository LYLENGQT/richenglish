<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
            'inquiryType' => 'required|string|in:general,student,teacher,technical,billing,other',
        ]);

        try {
            // TODO: Send email notification
            // Mail::to(config('mail.admin_email', 'admin@richenglish.com'))
            //     ->send(new ContactFormMail($validated));

            // TODO: Optionally save to database for tracking
            // ContactInquiry::create($validated);

            Log::info('Contact form submitted', [
                'email' => $validated['email'],
                'inquiry_type' => $validated['inquiryType'],
            ]);

            return response()->json([
                'message' => 'Thank you for your message! We will get back to you within 24 hours.',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to send message. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

