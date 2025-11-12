<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Public pages
Route::get('/about', fn () => Inertia::render('Public/About'))->name('about');
Route::get('/contact', fn () => Inertia::render('Public/Contact'))->name('contact');
Route::get('/faq', fn () => Inertia::render('Public/FAQ'))->name('faq');
Route::get('/apply', fn () => Inertia::render('Public/TeacherApplication'))->name('teacher-application');
Route::get('/leaderboard', fn () => Inertia::render('Public/TeacherLeaderboard'))->name('teacher-leaderboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/students', fn () => Inertia::render('Students/Index'))
        ->middleware('role:admin,super-admin')
        ->name('students.index');
    Route::get('/students/{student}', function ($student) {
        return Inertia::render('Students/Show', ['studentId' => $student]);
    })
        ->middleware('role:admin,super-admin,teacher')
        ->name('students.show');
    Route::get('/teachers', fn () => Inertia::render('Teachers/Index'))
        ->middleware('role:admin,super-admin')
        ->name('teachers.index');
    Route::get('/teachers/{user}', function ($user) {
        return Inertia::render('Teachers/Show', ['userId' => $user]);
    })
        ->middleware('role:admin,super-admin,teacher')
        ->name('teachers.show');
    Route::get('/teacher-applications', fn () => Inertia::render('TeacherApplications/Index'))
        ->middleware('role:super-admin')
        ->name('teacher-applications.index');
    Route::get('/admins/{user}', function ($user) {
        return Inertia::render('Admins/Show', ['userId' => $user]);
    })
        ->middleware('role:super-admin')
        ->name('admins.show');
    Route::get('/admins', fn () => Inertia::render('Teachers/Index', ['filterRole' => 'admin']))
        ->middleware('role:super-admin')
        ->name('admins.index');
    Route::get('/schedule', fn () => Inertia::render('Schedule/Index'))
        ->name('schedule.index');
    Route::get('/classes', fn () => Inertia::render('Classes/Index'))
        ->name('classes.index');
    Route::get('/classes/{classSchedule}', function ($classSchedule) {
        return Inertia::render('Classes/Show', ['classId' => $classSchedule]);
    })
        ->name('classes.show');
    Route::get('/makeup-classes', fn () => Inertia::render('MakeupClasses/Index'))
        ->name('makeup-classes.index');
    Route::get('/makeup-classes/{classSchedule}', function ($classSchedule) {
        return Inertia::render('MakeupClasses/Show', ['classId' => $classSchedule]);
    })
        ->name('makeup-classes.show');
    Route::get('/attendance', fn () => Inertia::render('Attendance/Index'))
        ->name('attendance.index');
    Route::get('/attendance/{attendance}', function ($attendance) {
        return Inertia::render('Attendance/Show', ['attendanceId' => $attendance]);
    })
        ->name('attendance.show');
    Route::get('/books', fn () => Inertia::render('Books/Index'))
        ->name('books.index');
    Route::get('/books/{book}', function ($book) {
        return Inertia::render('Books/Show', ['bookId' => $book]);
    })
        ->name('books.show');
    Route::get('/assignments', fn () => Inertia::render('Assignments/Index'))
        ->middleware('role:admin,super-admin')
        ->name('assignments.index');
    Route::get('/assignments/{bookAssignment}', function ($bookAssignment) {
        return Inertia::render('Assignments/Show', ['assignmentId' => $bookAssignment]);
    })
        ->middleware('role:admin,super-admin')
        ->name('assignments.show');
    Route::get('/recordings', fn () => Inertia::render('Recordings/Index'))
        ->name('recordings.index');
    Route::get('/recordings/{recording}', function ($recording) {
        return Inertia::render('Recordings/Show', ['recordingId' => $recording]);
    })
        ->name('recordings.show');
    Route::get('/screenshots', fn () => Inertia::render('Screenshots/Index'))
        ->name('screenshots.index');
    Route::get('/screenshots/{screenshot}', function ($screenshot) {
        return Inertia::render('Screenshots/Show', ['screenshotId' => $screenshot]);
    })
        ->name('screenshots.show');
    Route::get('/reports', fn () => Inertia::render('Reports/Index'))
        ->name('reports.index');
    Route::get('/search', fn () => Inertia::render('Search/Index'))
        ->name('search.index');
    Route::get('/messages', fn () => Inertia::render('Messages/Index'))
        ->name('messages.index');
    Route::get('/notifications', fn () => Inertia::render('Notifications/Index'))
        ->name('notifications.index');
    Route::get('/payouts', fn () => Inertia::render('Payouts/Index'))
        ->middleware('role:super-admin')
        ->name('payouts.index');
    Route::get('/payouts/{payout}', function ($payout) {
        return Inertia::render('Payouts/Show', ['payoutId' => $payout]);
    })
        ->middleware('role:super-admin')
        ->name('payouts.show');
    Route::get('/salary', fn () => Inertia::render('Salary/Index'))
        ->middleware('role:super-admin')
        ->name('salary.index');
    Route::get('/curriculum', fn () => Inertia::render('Curriculum/Index'))
        ->middleware('role:super-admin')
        ->name('curriculum.index');
    Route::get('/settings', fn () => Inertia::render('Settings/Index'))
        ->middleware('role:super-admin')
        ->name('settings.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
