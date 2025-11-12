<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        $users = User::query()
            ->whereKeyNot($request->user()->id)
            ->select(['id', 'name', 'email', 'role'])
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    public function conversation(Request $request, User $receiver): JsonResponse
    {
        $current = $request->user()->id;

        $messages = Message::query()
            ->where(function ($query) use ($current, $receiver): void {
                $query->where('sender_id', $current)
                    ->where('receiver_id', $receiver->id);
            })
            ->orWhere(function ($query) use ($current, $receiver): void {
                $query->where('sender_id', $receiver->id)
                    ->where('receiver_id', $current);
            })
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'receiver_id' => ['required', 'exists:users,id'],
            'message' => ['required', 'string'],
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $data['receiver_id'],
            'message' => $data['message'],
        ]);

        return response()->json($message, JsonResponse::HTTP_CREATED);
    }
}
