<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class TeacherApplicationReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->string('status')->toString() ?: 'pending';
        $search = $request->string('search')->toString();
        $limit = max(1, min((int) $request->integer('limit', 10), 50));
        $page = (int) $request->integer('page', 1);

        $query = User::teachers()
            ->with('teacherProfile')
            ->orderByDesc('created_at');

        $query->when($status === 'pending', function ($builder) {
            $builder->where('accepted', false)
                ->where(function ($inner) {
                    $inner->whereNull('meta->teacher_application_status')
                        ->orWhere('meta->teacher_application_status', 'pending');
                });
        });

        $query->when($status === 'approved', function ($builder) {
            $builder->where('accepted', true);
        });

        $query->when($status === 'rejected', function ($builder) {
            $builder->where('accepted', false)
                ->where('meta->teacher_application_status', 'rejected');
        });

        $query->when($search, function ($builder) use ($search) {
            $builder->where(function ($inner) use ($search) {
                $inner->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhereHas('teacherProfile', function ($profileQuery) use ($search) {
                        $profileQuery->where('first_name', 'like', '%' . $search . '%')
                            ->orWhere('last_name', 'like', '%' . $search . '%');
                    });
            });
        });

        $paginator = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'applications' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        abort_unless($user->isTeacher(), 404);

        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected', 'pending'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $meta = $user->meta ?? [];
        $meta['teacher_application_status'] = $data['status'];

        if (array_key_exists('notes', $data)) {
            if ($data['notes']) {
                $meta['teacher_application_notes'] = $data['notes'];
            } else {
                unset($meta['teacher_application_notes']);
            }
        }

        if ($data['status'] === 'approved') {
            $user->accepted = true;
            $user->status = 'active';
        } elseif ($data['status'] === 'rejected') {
            $user->accepted = false;
            $user->status = 'inactive';
        } else {
            $user->accepted = false;
            $user->status = 'active';
        }

        $user->meta = $meta;
        $user->save();

        $this->flushTeachersCache();

        return response()->json([
            'message' => 'Teacher application status updated.',
            'user' => $user->load('teacherProfile'),
        ]);
    }

    protected function flushTeachersCache(): void
    {
        $store = Cache::getStore();

        if (method_exists($store, 'tags')) {
            Cache::tags('teachers')->flush();

            return;
        }

        Cache::forget('teacher:index');
    }
}

