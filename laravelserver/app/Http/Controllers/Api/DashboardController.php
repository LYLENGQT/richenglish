<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Book;
use App\Models\BookAssignment;
use App\Models\ClassSchedule;
use App\Models\Payout;
use App\Models\Student;
use App\Models\TeacherProfile;
use App\Models\User;
use App\Models\UserNotification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfWeek = $now->copy()->startOfWeek();
        $endOfWeek = $startOfWeek->copy()->endOfWeek();

        if ($user->isSuperAdmin()) {
            $stats = [
                'totalAdmins' => User::admins()->count(),
                'totalTeachers' => User::teachers()->count(),
                'totalStudents' => Student::count(),
                'totalBooks' => Book::count(),
                'totalClasses' => ClassSchedule::count(),
                'totalPayouts' => Payout::count(),
                'totalNotifications' => UserNotification::count(),
                'totalBookAssignments' => BookAssignment::count(),
            ];

            return response()->json(['role' => 'super-admin', 'stats' => $stats]);
        }

        if ($user->isAdmin()) {
            $assignedTeacherIds = $user->assignedTeachers()->pluck('users.id');

            $stats = [
                'assignedTeachers' => $assignedTeacherIds->count(),
                'totalStudents' => Student::count(),
                'totalBooks' => Book::count(),
                'totalClasses' => ClassSchedule::where('created_by', $user->id)->count(),
                'totalNotifications' => UserNotification::where('user_id', $user->id)->count(),
                'totalPayouts' => Payout::count(),
            ];

            $monthHours = $this->aggregateAttendanceHours($assignedTeacherIds, $startOfMonth, null);
            $weekHours = $this->aggregateAttendanceHours($assignedTeacherIds, $startOfWeek, $endOfWeek);

            $ratePerHour = 200;

            $stats['totalHoursMonth'] = $monthHours;
            $stats['totalHoursWeek'] = $weekHours;
            $stats['totalPaymentMonth'] = $monthHours * $ratePerHour;
            $stats['totalPaymentWeek'] = $weekHours * $ratePerHour;

            return response()->json(['role' => 'admin', 'stats' => $stats]);
        }

        if ($user->isTeacher()) {
            $monthHours = Attendance::where('teacher_id', $user->id)
                ->whereDate('date', '>=', $startOfMonth)
                ->sum('hours');

            $weekHours = Attendance::where('teacher_id', $user->id)
                ->whereBetween('date', [$startOfWeek, $endOfWeek])
                ->sum('hours');

            $ratePerHour = 200;

            $stats = [
                'totalClasses' => ClassSchedule::where('teacher_id', $user->id)->count(),
                'totalStudents' => ClassSchedule::where('teacher_id', $user->id)->distinct('student_id')->count('student_id'),
                'totalPayouts' => Payout::where('teacher_id', $user->id)->count(),
                'totalNotifications' => UserNotification::where('user_id', $user->id)->count(),
                'totalAssignments' => BookAssignment::where('teacher_id', $user->id)->count(),
                'totalHoursMonth' => $monthHours,
                'totalHoursWeek' => $weekHours,
                'totalPaymentMonth' => $ratePerHour * $monthHours,
                'totalPaymentWeek' => $ratePerHour * $weekHours,
                'classes' => ClassSchedule::where('teacher_id', $user->id)
                    ->orderByDesc('start_date')
                    ->limit(10)
                    ->get([
                        'id',
                        'type',
                        'start_date',
                        'end_date',
                        'start_time',
                        'end_time',
                        'reoccurring_days',
                    ])->map(function ($class) {
                        return [
                            'id' => $class->id,
                            'type' => $class->type,
                            'start_date' => $class->start_date?->format('Y-m-d'),
                            'end_date' => $class->end_date?->format('Y-m-d'),
                            'start_time' => $class->start_time,
                            'end_time' => $class->end_time,
                            'reoccurring_days' => $class->reoccurring_days,
                        ];
                    }),
            ];

            return response()->json(['role' => 'teacher', 'stats' => $stats]);
        }

        return response()->json(['role' => $user->role, 'stats' => []]);
    }

    public function teacherDropdown(): JsonResponse
    {
        $teachers = User::teachers()
            ->where('accepted', true)
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return response()->json($teachers);
    }

    public function studentDropdown(): JsonResponse
    {
        $students = Student::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return response()->json($students);
    }

    protected function aggregateAttendanceHours($teacherIds, Carbon $from, ?Carbon $to): float
    {
        $query = Attendance::query()
            ->whereIn('teacher_id', $teacherIds)
            ->whereDate('date', '>=', $from);

        if ($to) {
            $query->whereDate('date', '<=', $to);
        }

        return (float) $query->sum('hours');
    }
}
