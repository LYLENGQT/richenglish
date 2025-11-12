<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class ClassScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ClassSchedule::with(['teacher', 'student', 'book']);

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->input('teacher_id'));
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->input('student_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('start_date')) {
            $query->whereDate('start_date', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('end_date', '<=', $request->input('end_date'));
        }

        if ($request->filled('platform_link')) {
            $query->where('platform_link', 'like', '%'.$request->input('platform_link').'%');
        }

        $limit = max(1, min((int) $request->integer('limit', 10), 100));
        $page = (int) $request->integer('page', 1);

        $paginator = $query->orderByDesc('start_date')->orderBy('start_time')->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'classes' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(ClassSchedule $classSchedule): JsonResponse
    {
        $class = $this->rememberClasses('class:'.$classSchedule->getKey(), function () use ($classSchedule) {
            return $classSchedule->load([
                'teacher',
                'student',
                'book',
                'makeUpClasses.teacher',
                'makeUpClasses.student',
                'attendances.teacher',
                'attendances.student',
                'recordings',
                'screenshots',
            ]);
        });

        return response()->json($class);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);

        $class = ClassSchedule::create($data);

        $this->flushClassCache();

        return response()->json([
            'message' => 'Class created successfully',
            'class' => $class->load(['teacher', 'student', 'book']),
        ], JsonResponse::HTTP_CREATED);
    }

    public function update(Request $request, ClassSchedule $classSchedule): JsonResponse
    {
        $data = $this->validatedData($request, $classSchedule);

        $classSchedule->update($data);
        $this->flushClassCache();

        return response()->json([
            'message' => 'Class updated successfully',
            'class' => $classSchedule->fresh()->load(['teacher', 'student', 'book']),
        ]);
    }

    public function destroy(ClassSchedule $classSchedule): JsonResponse
    {
        $classSchedule->delete();
        $this->flushClassCache();

        return response()->json(['message' => 'Class deleted successfully']);
    }

    protected function validatedData(Request $request, ?ClassSchedule $classSchedule = null): array
    {
        $isUpdate = $classSchedule !== null;

        $required = $isUpdate ? 'sometimes' : 'required';

        $rules = [
            'teacher_id' => [$required, 'exists:users,id'],
            'student_id' => [$required, 'exists:students,id'],
            'book_id' => ['nullable', 'exists:books,id'],
            'type' => [$required, Rule::in(['schedule', 'reoccurring', 'makeupClass'])],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'start_time' => [$required, 'date_format:H:i'],
            'end_time' => [$required, 'date_format:H:i'],
            'duration' => ['nullable', 'integer', 'min:1'],
            'reoccurring_days' => ['nullable', 'array'],
            'reoccurring_days.*' => [Rule::in(['M', 'T', 'W', 'TH', 'F', 'SAT', 'SUN'])],
            'platform_link' => ['nullable', 'string', 'max:1024'],
            'reason' => ['nullable', 'string'],
            'note' => ['nullable', 'string'],
            'original_class_id' => ['nullable', 'exists:classes,id'],
            'created_by' => ['nullable', 'exists:users,id'],
        ];

        $validated = $request->validate($rules);

        $type = $validated['type'] ?? $classSchedule?->type ?? 'schedule';

        if ($type !== 'reoccurring') {
            $request->validate([
                'start_date' => ['required', 'date'],
                'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            ]);
            $validated['start_date'] = $request->input('start_date');
            $validated['end_date'] = $request->input('end_date');
        } else {
            $request->validate([
                'reoccurring_days' => ['required', 'array', 'min:1'],
            ]);
            $validated['reoccurring_days'] = $request->input('reoccurring_days');
        }

        if ($type === 'makeupClass') {
            $request->validate([
                'reason' => ['required', 'string'],
                'note' => ['required', 'string'],
                'original_class_id' => ['required', 'exists:classes,id'],
            ]);
            $validated['reason'] = $request->input('reason');
            $validated['note'] = $request->input('note');
            $validated['original_class_id'] = $request->input('original_class_id');
        }

        if (! isset($validated['duration']) && isset($validated['start_time'], $validated['end_time'])) {
            $validated['duration'] = $this->calculateDuration(
                $validated['start_time'],
                $validated['end_time']
            );
        }

        return $validated;
    }

    protected function calculateDuration(string $startTime, string $endTime): int
    {
        [$startHour, $startMinute] = array_map('intval', explode(':', $startTime));
        [$endHour, $endMinute] = array_map('intval', explode(':', $endTime));

        $startMinutes = ($startHour * 60) + $startMinute;
        $endMinutes = ($endHour * 60) + $endMinute;

        if ($endMinutes <= $startMinutes) {
            $endMinutes += 24 * 60;
        }

        return $endMinutes - $startMinutes;
    }

    protected function flushClassCache(): void
    {
        if ($this->cacheStoreSupportsTags()) {
            Cache::tags('classes')->flush();

            return;
        }

        Cache::forget('class:index');
    }

    protected function rememberClasses(string $key, callable $callback)
    {
        if ($this->cacheStoreSupportsTags()) {
            return Cache::tags('classes')->remember($key, now()->addMinutes(5), $callback);
        }

        return Cache::remember('class:'.$key, now()->addMinutes(5), $callback);
    }

    protected function cacheStoreSupportsTags(): bool
    {
        $store = Cache::getStore();

        return method_exists($store, 'tags');
    }
}
