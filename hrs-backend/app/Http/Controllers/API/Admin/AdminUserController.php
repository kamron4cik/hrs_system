<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * GET /api/v1/admin/users
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('first_name', 'like', "%$s%")
                  ->orWhere('last_name', 'like', "%$s%")
                  ->orWhere('email', 'like', "%$s%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $users = $query->orderByDesc('created_at')->paginate(15);

        return response()->json([
            'status' => 200,
            'data'   => $users->map(fn($u) => $this->format($u)),
            'meta'   => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
            ],
        ]);
    }

    /**
     * POST /api/v1/admin/users
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:8',
            'role'       => 'required|in:guest,hotel_admin,super_admin',
            'phone'      => 'nullable|string|max:20',
            'is_active'  => 'boolean',
        ]);

        $user = User::create([
            ...$validated,
            'password' => bcrypt($validated['password']),
            'is_active' => $request->input('is_active', true),
        ]);

        return response()->json([
            'status'  => 201,
            'message' => 'User created successfully.',
            'data'    => $this->format($user),
        ], 201);
    }

    /**
     * PUT /api/v1/admin/users/{user}
     * Update role and/or is_active
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role'      => 'sometimes|in:guest,hotel_admin,super_admin',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'status'  => 200,
            'message' => 'User updated successfully.',
            'data'    => $this->format($user->fresh()),
        ]);
    }

    /**
     * PATCH /api/v1/admin/users/{user}/toggle
     * Toggle is_active
     */
    public function toggle(User $user): JsonResponse
    {
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'status'  => 200,
            'message' => $user->is_active ? 'User activated.' : 'User deactivated.',
            'data'    => $this->format($user->fresh()),
        ]);
    }

    private function format(User $u): array
    {
        return [
            'id'         => $u->id,
            'full_name'  => $u->full_name,
            'first_name' => $u->first_name,
            'last_name'  => $u->last_name,
            'email'      => $u->email,
            'role'       => $u->role,
            'phone'      => $u->phone,
            'is_active'  => $u->is_active,
            'created_at' => $u->created_at,
        ];
    }
}
