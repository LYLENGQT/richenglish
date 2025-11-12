<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookAssignmentController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\ClassScheduleController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PayoutController;
use App\Http\Controllers\Api\RecordingController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ScreenshotController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherApplicationReviewController;
use App\Http\Controllers\Api\TeacherController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::delete('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('refresh', [AuthController::class, 'refresh']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
        Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
        Route::post('resend-otp', [AuthController::class, 'resendOtp']);
    });

          // Public routes (no authentication required)
          Route::post('teacher-applications', [TeacherController::class, 'teacherApplication']);
          Route::post('contact', [\App\Http\Controllers\Api\ContactController::class, 'store']);
          Route::get('leaderboard', [\App\Http\Controllers\Api\LeaderboardController::class, 'index']);

    Route::get('health', fn () => ['status' => 'OK', 'timestamp' => now()->toIso8601String()]);

    Route::middleware(['auth:sanctum'])->group(function () {
        // Students - Legacy: POST requires super-admin only, DELETE requires super-admin
        Route::get('students', [StudentController::class, 'index']);
        Route::post('students', [StudentController::class, 'store'])->middleware('role:super-admin');
        Route::get('students/{student}', [StudentController::class, 'show']);
        Route::patch('students/{student}', [StudentController::class, 'update']);
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->middleware('role:super-admin');

        // Teachers - Legacy: GET/POST/PATCH require super-admin,admin; DELETE requires super-admin only
        Route::get('teacher', [TeacherController::class, 'index'])->middleware('role:super-admin,admin');
        Route::post('teacher', [TeacherController::class, 'store'])->middleware('role:super-admin,admin');
        Route::get('teacher/{user}', [TeacherController::class, 'show']);
        Route::patch('teacher/{user}', [TeacherController::class, 'update'])->middleware('role:super-admin,admin');
        Route::delete('teacher/{user}', [TeacherController::class, 'destroy'])->middleware('role:super-admin');

        // Teacher applications review - super admin only
        Route::middleware('role:super-admin')->prefix('teacher-applications')->group(function () {
            Route::get('/', [TeacherApplicationReviewController::class, 'index']);
            Route::patch('{user}', [TeacherApplicationReviewController::class, 'update']);
        });

        // Classes - Legacy: POST requires super-admin,admin; PATCH/DELETE are authenticated only
        Route::get('class', [ClassScheduleController::class, 'index']);
        Route::post('class', [ClassScheduleController::class, 'store'])->middleware('role:super-admin,admin');
        Route::get('class/{classSchedule}', [ClassScheduleController::class, 'show']);
        Route::patch('class/{classSchedule}', [ClassScheduleController::class, 'update']);
        Route::delete('class/{classSchedule}', [ClassScheduleController::class, 'destroy']);

        // Attendance - Legacy: POST/PATCH/DELETE require admin,super-admin
        Route::get('attendance', [AttendanceController::class, 'index']);
        Route::post('attendance', [AttendanceController::class, 'store'])->middleware('role:admin,super-admin');
        Route::get('attendance/{attendance}', [AttendanceController::class, 'show']);
        Route::patch('attendance/{attendance}', [AttendanceController::class, 'update'])->middleware('role:admin,super-admin');
        Route::delete('attendance/{attendance}', [AttendanceController::class, 'destroy'])->middleware('role:admin,super-admin');

          // Books - Legacy: POST requires admin,super-admin
          Route::get('books', [BookController::class, 'index']);
          Route::post('books', [BookController::class, 'store'])->middleware('role:admin,super-admin');
          Route::get('books/{book}', [BookController::class, 'show']);
          Route::get('books/{book}/stream', [BookController::class, 'stream']);

        // Book Assignments - Legacy: POST/PATCH/DELETE require super-admin,admin
        Route::get('book-assign', [BookAssignmentController::class, 'index']);
        Route::post('book-assign', [BookAssignmentController::class, 'store'])->middleware('role:super-admin,admin');
        Route::get('book-assign/{bookAssignment}', [BookAssignmentController::class, 'show']);
        Route::patch('book-assign/{bookAssignment}', [BookAssignmentController::class, 'update'])->middleware('role:super-admin,admin');
        Route::delete('book-assign/{bookAssignment}', [BookAssignmentController::class, 'destroy'])->middleware('role:super-admin,admin');

        // Notifications - Legacy: All routes are authenticated only
        Route::get('notification', [NotificationController::class, 'index']);
        Route::post('notification', [NotificationController::class, 'store']);
        Route::get('notification/{notification}', [NotificationController::class, 'show']);
        Route::patch('notification/{notification}', [NotificationController::class, 'markAsRead']);

        // Messages - Legacy: All routes are authenticated only
        Route::get('message/users', [MessageController::class, 'users']);
        Route::get('message/{receiver}', [MessageController::class, 'conversation']);
        Route::post('message', [MessageController::class, 'store']);

        // Payouts - Legacy: GET/POST/PATCH require super-admin only; DELETE requires super-admin only
        Route::get('payout', [PayoutController::class, 'index'])->middleware('role:super-admin');
        Route::post('payout', [PayoutController::class, 'store'])->middleware('role:super-admin');
        Route::get('payout/{payout}', [PayoutController::class, 'show']);
        Route::patch('payout/{payout}', [PayoutController::class, 'update'])->middleware('role:super-admin');
        Route::delete('payout/{payout}', [PayoutController::class, 'destroy'])->middleware('role:super-admin');

        // Recordings - Legacy: POST is authenticated; PATCH/DELETE require requireAdmin (likely super-admin,admin)
        Route::get('recording', [RecordingController::class, 'index']);
        Route::post('recording', [RecordingController::class, 'store']);
        Route::get('recording/{recording}', [RecordingController::class, 'show']);
        Route::patch('recording/{recording}', [RecordingController::class, 'update'])->middleware('role:super-admin,admin');
        Route::delete('recording/{recording}', [RecordingController::class, 'destroy'])->middleware('role:super-admin,admin');

        // Screenshots - Legacy: POST is authenticated; PATCH/DELETE require requireAdmin (likely super-admin,admin)
        Route::get('screen-shot', [ScreenshotController::class, 'index']);
        Route::post('screen-shot', [ScreenshotController::class, 'store']);
        Route::get('screen-shot/{screenshot}', [ScreenshotController::class, 'show']);
        Route::patch('screen-shot/{screenshot}', [ScreenshotController::class, 'update'])->middleware('role:super-admin,admin');
        Route::delete('screen-shot/{screenshot}', [ScreenshotController::class, 'destroy'])->middleware('role:super-admin,admin');

        // Dashboard - Legacy: /teachers requires admin,super-admin,teacher
        Route::get('dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('dashboard/teachers', [DashboardController::class, 'teacherDropdown'])->middleware('role:admin,super-admin,teacher');
        Route::get('dashboard/students', [DashboardController::class, 'studentDropdown']);

        // Reports - Generate reports from existing data
        Route::get('reports', [ReportController::class, 'index']);

        // Search - Global search across all resources
        Route::get('search', [SearchController::class, 'index']);
    });
});

