<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookAssignment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class BookAssignmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $assignments = BookAssignment::with(['student', 'teacher', 'book', 'assignedBy'])
            ->latest()
            ->paginate(max(1, min((int) $request->integer('limit', 20), 100)));

        return response()->json([
            'assignments' => $assignments->items(),
            'pagination' => [
                'total' => $assignments->total(),
                'page' => $assignments->currentPage(),
                'limit' => $assignments->perPage(),
                'totalPages' => $assignments->lastPage(),
            ],
        ]);
    }

    public function show(BookAssignment $bookAssignment): JsonResponse
    {
        return response()->json(
            $bookAssignment->load(['student', 'teacher', 'book', 'assignedBy'])
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'teacher_id' => ['required', 'exists:users,id'],
            'book_id' => ['required', 'exists:books,id'],
        ]);

        $assignment = BookAssignment::create([
            ...$data,
            'assigned_by' => $request->user()->id,
        ]);

        $this->flushAssignmentsCache();

        return response()->json([
            'assignment' => $assignment->load(['student', 'teacher', 'book', 'assignedBy']),
        ], JsonResponse::HTTP_CREATED);
    }

    public function update(Request $request, BookAssignment $bookAssignment): JsonResponse
    {
        $data = $request->validate([
            'student_id' => ['sometimes', 'required', 'exists:students,id'],
            'teacher_id' => ['sometimes', 'required', 'exists:users,id'],
            'book_id' => ['sometimes', 'required', 'exists:books,id'],
        ]);

        $bookAssignment->update($data);

        $this->flushAssignmentsCache();

        return response()->json([
            'assignment' => $bookAssignment->fresh()->load(['student', 'teacher', 'book', 'assignedBy']),
        ]);
    }

    public function destroy(BookAssignment $bookAssignment): JsonResponse
    {
        $bookAssignment->delete();
        $this->flushAssignmentsCache();

        return response()->json(['message' => 'Deleted successfully']);
    }

    protected function flushAssignmentsCache(): void
    {
        if ($this->cacheStoreSupportsTags()) {
            Cache::tags('book-assignments')->flush();

            return;
        }

        Cache::forget('book-assignments:index');
    }

    protected function cacheStoreSupportsTags(): bool
    {
        $store = Cache::getStore();

        return method_exists($store, 'tags');
    }
}
