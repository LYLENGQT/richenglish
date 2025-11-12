<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Recording;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecordingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Recording::with(['classSchedule', 'attendance', 'uploader']);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->input('class_id'));
        }

        if ($request->filled('attendance_id')) {
            $query->where('attendance_id', $request->input('attendance_id'));
        }

        $recordings = $query->orderByDesc('created_at')->paginate(
            max(1, min((int) $request->integer('limit', 20), 100))
        );

        return response()->json([
            'recordings' => $recordings->items(),
            'pagination' => [
                'total' => $recordings->total(),
                'page' => $recordings->currentPage(),
                'limit' => $recordings->perPage(),
                'totalPages' => $recordings->lastPage(),
            ],
        ]);
    }

    public function show(Recording $recording): JsonResponse
    {
        $recording->load([
            'classSchedule.teacher',
            'classSchedule.student',
            'classSchedule.book',
            'attendance.teacher',
            'attendance.student',
            'uploader',
        ]);

        return response()->json($recording);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'class_id' => ['required', 'exists:classes,id'],
            'attendance_id' => ['nullable', 'exists:attendances,id'],
            'file' => ['required', 'file', 'mimes:mp4,mov,webm,avi', 'max:102400'],
        ]);

        $path = $request->file('file')->store('uploads/recordings', 'public');

        $recording = Recording::create([
            'class_id' => $data['class_id'],
            'attendance_id' => $data['attendance_id'] ?? null,
            'uploaded_by' => $request->user()->id,
            'path' => $path,
            'filename' => basename($path),
            'drive' => null,
        ]);

        return response()->json(['recording' => $recording->load(['classSchedule', 'attendance'])], JsonResponse::HTTP_CREATED);
    }

    public function destroy(Recording $recording): JsonResponse
    {
        if ($recording->path) {
            Storage::disk('public')->delete($recording->path);
        }

        $recording->delete();

        return response()->json(['message' => 'Recording deleted']);
    }
}
