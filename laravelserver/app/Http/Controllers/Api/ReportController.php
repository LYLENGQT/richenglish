<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ClassSchedule;
use App\Models\Payout;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $reportType = $request->input('type', 'attendance');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $teacherId = $request->input('teacher_id');
        $studentId = $request->input('student_id');

        $reports = [];

        switch ($reportType) {
            case 'attendance':
                $reports = $this->generateAttendanceReport($user, $startDate, $endDate, $teacherId, $studentId);
                break;
            case 'classes':
                $reports = $this->generateClassReport($user, $startDate, $endDate, $teacherId, $studentId);
                break;
            case 'payouts':
                $reports = $this->generatePayoutReport($user, $startDate, $endDate, $teacherId);
                break;
            case 'students':
                $reports = $this->generateStudentReport($user, $startDate, $endDate);
                break;
            default:
                $reports = $this->generateAttendanceReport($user, $startDate, $endDate, $teacherId, $studentId);
        }

        return response()->json([
            'report_type' => $reportType,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'teacher_id' => $teacherId,
                'student_id' => $studentId,
            ],
            'data' => $reports,
            'summary' => $this->generateSummary($reportType, $reports),
        ]);
    }

    protected function generateAttendanceReport($user, $startDate, $endDate, $teacherId, $studentId): array
    {
        $query = Attendance::with(['teacher', 'student', 'classSchedule']);

        if ($user->isTeacher()) {
            $query->where('teacher_id', $user->id);
        } elseif ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($studentId) {
            $query->where('student_id', $studentId);
        }

        if ($startDate) {
            $query->whereDate('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('date', '<=', $endDate);
        }

        return $query->orderByDesc('date')->get()->toArray();
    }

    protected function generateClassReport($user, $startDate, $endDate, $teacherId, $studentId): array
    {
        $query = ClassSchedule::with(['teacher', 'student', 'book']);

        if ($user->isTeacher()) {
            $query->where('teacher_id', $user->id);
        } elseif ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($studentId) {
            $query->where('student_id', $studentId);
        }

        if ($startDate) {
            $query->whereDate('start_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('end_date', '<=', $endDate);
        }

        return $query->orderByDesc('start_date')->get()->toArray();
    }

    protected function generatePayoutReport($user, $startDate, $endDate, $teacherId): array
    {
        if (!$user->isSuperAdmin() && !$user->isAdmin()) {
            return [];
        }

        $query = Payout::with(['teacher']);

        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($startDate) {
            $query->whereDate('start_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('end_date', '<=', $endDate);
        }

        return $query->orderByDesc('start_date')->get()->toArray();
    }

    protected function generateStudentReport($user, $startDate, $endDate): array
    {
        if (!$user->isSuperAdmin() && !$user->isAdmin()) {
            return [];
        }

        $query = Student::with(['classes', 'attendances', 'bookAssignments']);

        if ($startDate || $endDate) {
            // Filter students who have classes/attendance in the date range
            $query->whereHas('classes', function ($q) use ($startDate, $endDate) {
                if ($startDate) {
                    $q->whereDate('start_date', '>=', $startDate);
                }
                if ($endDate) {
                    $q->whereDate('end_date', '<=', $endDate);
                }
            });
        }

        return $query->orderBy('name')->get()->toArray();
    }

    protected function generateSummary(string $reportType, array $data): array
    {
        switch ($reportType) {
            case 'attendance':
                return [
                    'total_records' => count($data),
                    'total_hours' => array_sum(array_column($data, 'hours')),
                    'total_minutes' => array_sum(array_column($data, 'minutes_attended')),
                ];
            case 'classes':
                return [
                    'total_classes' => count($data),
                    'scheduled' => count(array_filter($data, fn($c) => $c['type'] === 'schedule')),
                    'recurring' => count(array_filter($data, fn($c) => $c['type'] === 'reoccurring')),
                    'makeup' => count(array_filter($data, fn($c) => $c['type'] === 'makeupClass')),
                ];
            case 'payouts':
                return [
                    'total_payouts' => count($data),
                    'total_amount' => array_sum(array_column($data, 'total_amount')),
                    'pending' => count(array_filter($data, fn($p) => $p['status'] === 'pending')),
                    'completed' => count(array_filter($data, fn($p) => $p['status'] === 'completed')),
                ];
            case 'students':
                return [
                    'total_students' => count($data),
                ];
            default:
                return [];
        }
    }
}

