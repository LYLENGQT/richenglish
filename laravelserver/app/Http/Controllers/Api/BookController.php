<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Book::query();

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($builder) use ($search): void {
                $builder->where('title', 'like', '%'.$search.'%')
                    ->orWhere('original_filename', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('uploaded_by')) {
            $query->where('uploaded_by', $request->input('uploaded_by'));
        }

        $books = $query->orderByDesc('created_at')->paginate(
            max(1, min((int) $request->integer('limit', 20), 100))
        );

        return response()->json([
            'books' => $books->items(),
            'pagination' => [
                'total' => $books->total(),
                'page' => $books->currentPage(),
                'limit' => $books->perPage(),
                'totalPages' => $books->lastPage(),
            ],
        ]);
    }

    public function show(Book $book): JsonResponse
    {
        $bookData = $book->load([
            'bookAssignments.student',
            'bookAssignments.teacher',
            'bookAssignments.assignedBy',
        ]);

        return response()->json($bookData);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240'],
        ]);

        $file = $data['file'];
        $path = $file->store('uploads/books', 'public');

        $book = Book::create([
            'title' => $data['title'],
            'filename' => basename($path),
            'original_filename' => $file->getClientOriginalName(),
            'path' => $path,
            'drive' => null,
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json(['book' => $book], JsonResponse::HTTP_CREATED);
    }

    public function update(Request $request, Book $book): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240'],
        ]);

        if (isset($data['title'])) {
            $book->title = $data['title'];
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads/books', 'public');

            if ($book->path) {
                Storage::disk('public')->delete($book->path);
            }

            $book->path = $path;
            $book->filename = basename($path);
            $book->original_filename = $file->getClientOriginalName();
        }

        $book->save();

        return response()->json(['book' => $book]);
    }

    public function destroy(Book $book): JsonResponse
    {
        if ($book->path) {
            Storage::disk('public')->delete($book->path);
        }

        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }

    public function stream(Book $book)
    {
        if (! $book->path || ! Storage::disk('public')->exists($book->path)) {
            abort(404, 'Book file not found');
        }

        $filePath = Storage::disk('public')->path($book->path);
        $mimeType = Storage::disk('public')->mimeType($book->path);

        return response()->file($filePath, [
            'Content-Type' => $mimeType ?? 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$book->original_filename.'"',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
