<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PayoutController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payout::with('teacher');

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->input('teacher_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('start_date')) {
            $query->whereDate('start_date', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('end_date', '<=', $request->input('end_date'));
        }

        $payouts = $query->orderByDesc('created_at')
            ->paginate(max(1, min((int) $request->integer('limit', 20), 100)));

        return response()->json([
            'payouts' => $payouts->items(),
            'pagination' => [
                'total' => $payouts->total(),
                'page' => $payouts->currentPage(),
                'limit' => $payouts->perPage(),
                'totalPages' => $payouts->lastPage(),
            ],
        ]);
    }

    public function show(Payout $payout): JsonResponse
    {
        $payoutData = $payout->load('teacher');
        return response()->json($payoutData);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);

        $payout = Payout::create($data + ['teacher_id' => $data['teacher_id']]);

        return response()->json(['payout' => $payout->load('teacher')], JsonResponse::HTTP_CREATED);
    }

    public function update(Request $request, Payout $payout): JsonResponse
    {
        $data = $this->validatedData($request, true);

        $payout->update($data);

        return response()->json(['payout' => $payout->fresh()->load('teacher')]);
    }

    public function destroy(Payout $payout): JsonResponse
    {
        $payout->delete();

        return response()->json(['message' => 'Payout deleted']);
    }

    protected function validatedData(Request $request, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return $request->validate([
            'teacher_id' => [$required, 'exists:users,id'],
            'start_date' => [$required, 'date'],
            'end_date' => [$required, 'date', 'after_or_equal:start_date'],
            'duration' => [$required, 'integer', 'min:0'],
            'total_class' => [$required, 'integer', 'min:0'],
            'incentives' => ['nullable', 'numeric', 'min:0'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'status' => [$required, Rule::in(['pending', 'processing', 'completed'])],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
