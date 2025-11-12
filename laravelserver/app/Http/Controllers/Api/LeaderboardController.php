<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Attendance;
use App\Models\ClassSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $period = $request->input('period', 'current'); // current, previous, year

        // Calculate date range based on period
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        if ($period === 'previous') {
            $startDate = now()->subMonth()->startOfMonth();
            $endDate = now()->subMonth()->endOfMonth();
        } elseif ($period === 'year') {
            $startDate = now()->startOfYear();
            $endDate = now()->endOfYear();
        }

        // Get teachers with their statistics
        $teachers = User::where('role', 'teacher')
            ->where('accepted', true)
            ->with(['teacherProfile'])
            ->get()
            ->map(function ($teacher) use ($startDate, $endDate) {
                // Get classes in the period
                $classes = ClassSchedule::where('teacher_id', $teacher->id)
                    ->whereBetween('start_date', [$startDate, $endDate])
                    ->get();

                // Get attendance records
                $attendances = Attendance::where('teacher_id', $teacher->id)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->get();

                $totalClasses = $classes->count();
                $attendedClasses = $attendances->count();
                $attendanceRate = $totalClasses > 0
                    ? ($attendedClasses / $totalClasses) * 100
                    : 0;

                // Calculate student feedback (mock for now, should come from feedback table)
                $studentFeedback = 4.5 + (rand(0, 50) / 100); // Random between 4.5-5.0

                // Calculate responsiveness (mock for now)
                $responsiveness = 80 + (rand(0, 20)); // Random between 80-100

                // Determine level (mock for now, should come from teacher profile)
                $level = $teacher->teacherProfile?->experience ?? 'Junior';
                if ($totalClasses > 200) {
                    $level = 'Senior';
                } elseif ($totalClasses > 100) {
                    $level = 'Intermediate';
                }

                // Determine badge
                $badge = 'Bronze';
                if ($attendanceRate >= 98 && $studentFeedback >= 4.8) {
                    $badge = 'Gold';
                } elseif ($attendanceRate >= 96 && $studentFeedback >= 4.6) {
                    $badge = 'Silver';
                }

                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'picture' => null, // TODO: Add profile picture field
                    'totalClasses' => $totalClasses,
                    'attendanceRate' => round($attendanceRate, 1),
                    'studentFeedback' => round($studentFeedback, 1),
                    'responsiveness' => round($responsiveness, 0),
                    'level' => $level,
                    'badge' => $badge,
                ];
            })
            ->sortByDesc(function ($teacher) {
                // Sort by weighted score
                return ($teacher['attendanceRate'] * 0.3) +
                    ($teacher['studentFeedback'] * 20) +
                    ($teacher['responsiveness'] * 0.2) +
                    ($teacher['totalClasses'] * 0.1);
            })
            ->values()
            ->take(20)
            ->map(function ($teacher, $index) {
                $teacher['rank'] = $index + 1;
                return $teacher;
            });

        return response()->json([
            'data' => $teachers,
            'period' => $period,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
        ]);
    }
}

