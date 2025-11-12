<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = UserNotification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(max(1, min((int) $request->integer('limit', 20), 100)));

        return response()->json([
            'notifications' => $notifications->items(),
            'pagination' => [
                'total' => $notifications->total(),
                'page' => $notifications->currentPage(),
                'limit' => $notifications->perPage(),
                'totalPages' => $notifications->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'type' => ['nullable', 'string', 'max:50'],
        ]);

        $notification = UserNotification::create($data);

        return response()->json(['notification' => $notification], JsonResponse::HTTP_CREATED);
    }

    public function show(Request $request, UserNotification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        return response()->json($notification);
    }

    public function markAsRead(Request $request, UserNotification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['is_read' => true]);

        return response()->json(['notification' => $notification]);
    }

    public function destroy(Request $request, UserNotification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }
}
