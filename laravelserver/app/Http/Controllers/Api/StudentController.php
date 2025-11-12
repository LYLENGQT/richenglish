<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (! $this->hasFilters($request) && ! $request->filled('page') && ! $request->filled('limit')) {
            $students = $this->rememberStudents('all', fn () => Student::orderBy('name')->get());

            return response()->json([
                'students' => $students,
                'total' => $students->count(),
            ]);
        }

        $query = Student::query();

        if ($name = $request->string('name')->trim()->toString()) {
            $query->where('name', 'like', '%'.$name.'%');
        }

        if ($nationality = $request->string('nationality')->upper()->toString()) {
            $query->where('nationality', $nationality);
        }

        if ($managerType = $request->string('manager_type')->upper()->toString()) {
            $query->where('manager_type', $managerType);
        }

        if ($category = $request->string('category_level')->toString()) {
            $query->where('category_level', $category);
        }

        if ($classType = $request->string('class_type')->toString()) {
            $query->where('class_type', $classType);
        }

        if ($platform = $request->string('platform')->toString()) {
            $query->where('platform', $platform);
        }

        $limit = (int) $request->integer('limit', 10);
        $limit = max(1, min($limit, 100));
        $page = (int) $request->integer('page', 1);

        $paginator = $query->orderBy('created_at', 'desc')->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'students' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(Student $student): JsonResponse
    {
        $cacheKey = 'student:'.$student->getKey();

        $data = $this->rememberStudents($cacheKey, function () use ($student) {
            return $student->load([
                'classes.teacher',
                'classes.book',
                'attendances.teacher',
                'attendances.classSchedule',
                'bookAssignments.teacher',
                'bookAssignments.book',
                'bookAssignments.assignedBy',
            ]);
        });

        return response()->json($data);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'age' => ['nullable', 'integer', 'min:0', 'max:150'],
            'nationality' => ['nullable', Rule::in(['KOREAN', 'CHINESE'])],
            'manager_type' => ['nullable', 'string', 'max:10'],
            'email' => ['nullable', 'email', 'max:255'],
            'category_level' => ['nullable', 'string', 'max:255'],
            'class_type' => ['nullable', 'string', 'max:255'],
            'platform' => ['nullable', Rule::in(['Zoom', 'Voov'])],
            'platform_link' => ['nullable', 'string', 'max:1024'],
            'preferred_book' => ['nullable', 'string', 'max:255'],
        ]);

        $student = Student::create($data);
        $this->flushStudentsCache();

        return response()->json(['student' => $student], JsonResponse::HTTP_CREATED);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'age' => ['nullable', 'integer', 'min:0', 'max:150'],
            'nationality' => ['nullable', Rule::in(['KOREAN', 'CHINESE'])],
            'manager_type' => ['nullable', 'string', 'max:10'],
            'email' => ['nullable', 'email', 'max:255'],
            'category_level' => ['nullable', 'string', 'max:255'],
            'class_type' => ['nullable', 'string', 'max:255'],
            'platform' => ['nullable', Rule::in(['Zoom', 'Voov'])],
            'platform_link' => ['nullable', 'string', 'max:1024'],
            'preferred_book' => ['nullable', 'string', 'max:255'],
            'student_identification' => ['nullable', 'string', 'max:255', 'unique:students,student_identification,'.$student->id],
        ]);

        // Don't update student_identification if it's not provided (it's read-only in the UI)
        if (!isset($data['student_identification'])) {
            unset($data['student_identification']);
        }

        $student->update($data);
        $this->flushStudentsCache();

        return response()->json(['student' => $student->fresh()]);
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->delete();
        $this->flushStudentsCache();

        return response()->json(['message' => 'Student deleted successfully']);
    }

    protected function hasFilters(Request $request): bool
    {
        return $request->filled([
            'name', 'nationality', 'manager_type', 'category_level', 'class_type', 'platform',
        ]);
    }

    protected function rememberStudents(string $key, callable $callback)
    {
        if ($this->cacheStoreSupportsTags()) {
            return Cache::tags('students')->remember($key, now()->addMinutes(5), $callback);
        }

        return Cache::remember('students:'.$key, now()->addMinutes(5), $callback);
    }

    protected function flushStudentsCache(): void
    {
        if ($this->cacheStoreSupportsTags()) {
            Cache::tags('students')->flush();

            return;
        }

        Cache::forget('students:all');
    }

    protected function cacheStoreSupportsTags(): bool
    {
        $store = Cache::getStore();

        return method_exists($store, 'tags');
    }
}
