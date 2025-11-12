<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Screenshot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ScreenshotController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Screenshot::with(['classSchedule', 'attendance', 'uploader']);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->input('class_id'));
        }

        if ($request->filled('attendance_id')) {
            $query->where('attendance_id', $request->input('attendance_id'));
        }

        $screenshots = $query->orderByDesc('created_at')->paginate(
            max(1, min((int) $request->integer('limit', 20), 100))
        );

        return response()->json([
            'screenshots' => $screenshots->items(),
            'pagination' => [
                'total' => $screenshots->total(),
                'page' => $screenshots->currentPage(),
                'limit' => $screenshots->perPage(),
                'totalPages' => $screenshots->lastPage(),
            ],
        ]);
    }

    public function show(Screenshot $screenshot): JsonResponse
    {
        $screenshot->load([
            'classSchedule.teacher',
            'classSchedule.student',
            'classSchedule.book',
            'attendance.teacher',
            'attendance.student',
            'uploader',
        ]);

        return response()->json($screenshot);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'class_id' => ['required', 'exists:classes,id'],
            'attendance_id' => ['nullable', 'exists:attendances,id'],
            'file' => ['required', 'file', 'image', 'max:5120'],
        ]);

        $path = $request->file('file')->store('uploads/screenshots', 'public');

        $screenshot = Screenshot::create([
            'class_id' => $data['class_id'],
            'attendance_id' => $data['attendance_id'] ?? null,
            'uploaded_by' => $request->user()->id,
            'path' => $path,
            'filename' => basename($path),
            'drive' => null,
        ]);

        return response()->json(['screenshot' => $screenshot->load(['classSchedule', 'attendance'])], JsonResponse::HTTP_CREATED);
    }

    public function destroy(Screenshot $screenshot): JsonResponse
    {
        if ($screenshot->path) {
            Storage::disk('public')->delete($screenshot->path);
        }

        $screenshot->delete();

        return response()->json(['message' => 'Screenshot deleted']);
    }
}
