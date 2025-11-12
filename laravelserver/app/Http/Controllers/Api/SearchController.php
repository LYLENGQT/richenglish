<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Book;
use App\Models\ClassSchedule;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        $type = $request->input('type', 'all'); // all, students, teachers, classes, books

        if (empty($query)) {
            return response()->json([
                'query' => $query,
                'type' => $type,
                'results' => [],
                'summary' => [
                    'total' => 0,
                ],
            ]);
        }

        $results = [];

        if ($type === 'all' || $type === 'students') {
            $students = Student::where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->orWhere('student_identification', 'like', "%{$query}%")
                ->orWhere('nationality', 'like', "%{$query}%")
                ->limit(10)
                ->get(['id', 'name', 'email', 'student_identification', 'nationality'])
                ->map(function ($student) {
                    return [
                        'type' => 'student',
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                        'identifier' => $student->student_identification,
                        'nationality' => $student->nationality,
                        'url' => route('students.show', $student->id),
                    ];
                });

            $results = array_merge($results, $students->toArray());
        }

        if ($type === 'all' || $type === 'teachers') {
            $teachers = User::teachers()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get(['id', 'name', 'email', 'role'])
                ->map(function ($teacher) {
                    return [
                        'type' => 'teacher',
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role,
                        'url' => route('teachers.show', $teacher->id),
                    ];
                });

            $results = array_merge($results, $teachers->toArray());
        }

        if ($type === 'all' || $type === 'classes') {
            $classes = ClassSchedule::with(['teacher', 'student', 'book'])
                ->whereHas('teacher', function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%");
                })
                ->orWhereHas('student', function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%");
                })
                ->orWhereHas('book', function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get()
                ->map(function ($class) {
                    return [
                        'type' => 'class',
                        'id' => $class->id,
                        'teacher' => $class->teacher?->name,
                        'student' => $class->student?->name,
                        'book' => $class->book?->title,
                        'date' => $class->start_date,
                        'time' => $class->start_time,
                        'url' => route('classes.show', $class->id),
                    ];
                });

            $results = array_merge($results, $classes->toArray());
        }

        if ($type === 'all' || $type === 'books') {
            $books = Book::where('title', 'like', "%{$query}%")
                ->orWhere('filename', 'like', "%{$query}%")
                ->limit(10)
                ->get(['id', 'title', 'filename'])
                ->map(function ($book) {
                    return [
                        'type' => 'book',
                        'id' => $book->id,
                        'title' => $book->title,
                        'filename' => $book->filename,
                        'url' => route('books.show', $book->id),
                    ];
                });

            $results = array_merge($results, $books->toArray());
        }

        return response()->json([
            'query' => $query,
            'type' => $type,
            'results' => $results,
            'summary' => [
                'total' => count($results),
                'students' => count(array_filter($results, fn($r) => $r['type'] === 'student')),
                'teachers' => count(array_filter($results, fn($r) => $r['type'] === 'teacher')),
                'classes' => count(array_filter($results, fn($r) => $r['type'] === 'class')),
                'books' => count(array_filter($results, fn($r) => $r['type'] === 'book')),
            ],
        ]);
    }
}

