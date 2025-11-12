<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Attendance::with(['teacher', 'student', 'classSchedule']);

        foreach (['teacher_id', 'student_id', 'class_id'] as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->input('date'));
        }

        $limit = max(1, min((int) $request->integer('limit', 10), 100));
        $page = (int) $request->integer('page', 1);

        $paginator = $query
            ->orderByDesc('date')
            ->orderBy('start_time')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'attendances' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(Attendance $attendance): JsonResponse
    {
        $cacheKey = 'attendance:'.$attendance->getKey();

        $data = $this->rememberAttendance($cacheKey, function () use ($attendance) {
            return $attendance->load([
                'teacher',
                'student',
                'classSchedule',
                'screenshots',
                'recording',
            ]);
        });

        return response()->json($data);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);

        $attendance = Attendance::create($data);

        $this->flushAttendanceCache();

        return response()->json([
            'attendance' => $attendance->load(['teacher', 'student', 'classSchedule']),
        ], JsonResponse::HTTP_CREATED);
    }

    public function update(Request $request, Attendance $attendance): JsonResponse
    {
        $data = $this->validatedData($request, $attendance);

        $attendance->update($data);

        $this->flushAttendanceCache();

        return response()->json([
            'attendance' => $attendance->fresh()->load(['teacher', 'student', 'classSchedule']),
        ]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();
        $this->flushAttendanceCache();

        return response()->json(['message' => 'Attendance deleted successfully']);
    }

    protected function validatedData(Request $request, ?Attendance $attendance = null): array
    {
        $required = $attendance ? 'sometimes' : 'required';

        $rules = [
            'teacher_id' => [$required, 'exists:users,id'],
            'student_id' => [$required, 'exists:students,id'],
            'class_id' => [$required, 'exists:classes,id'],
            'date' => [$required, 'date'],
            'duration' => [$required, 'integer', 'min:1'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'minutes_attended' => ['nullable', 'integer', 'min:0'],
            'hours' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];

        $validated = $request->validate($rules);

        if (isset($validated['minutes_attended'], $validated['duration']) &&
            $validated['minutes_attended'] > $validated['duration']) {
            throw ValidationException::withMessages([
                'minutes_attended' => __('Minutes attended cannot exceed duration.'),
            ]);
        }

        return $validated;
    }

    protected function rememberAttendance(string $key, callable $callback)
    {
        if ($this->cacheStoreSupportsTags()) {
            return Cache::tags('attendances')->remember($key, now()->addMinutes(5), $callback);
        }

        return Cache::remember('attendance:'.$key, now()->addMinutes(5), $callback);
    }

    protected function flushAttendanceCache(): void
    {
        if ($this->cacheStoreSupportsTags()) {
            Cache::tags('attendances')->flush();

            return;
        }

        Cache::forget('attendance:index');
    }

    protected function cacheStoreSupportsTags(): bool
    {
        $store = Cache::getStore();

        return method_exists($store, 'tags');
    }
}
