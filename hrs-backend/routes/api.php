<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\HotelController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\RoomController;
use App\Http\Controllers\API\Admin\AdminDashboardController;
use App\Http\Controllers\API\Admin\AdminHotelController;
use App\Http\Controllers\API\Admin\AdminUserController;
use App\Http\Controllers\API\Admin\ReportController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

// ─── Public routes ────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('register',         [AuthController::class, 'register']);
        Route::post('login',            [AuthController::class, 'login']);
        Route::post('forgot-password',  [AuthController::class, 'forgotPassword']);
        Route::post('reset-password',   [AuthController::class, 'resetPassword']);
    });

    // Hotels (public read)
    Route::get('hotels',                    [HotelController::class, 'index']);
    Route::get('hotels/{hotel}',            [HotelController::class, 'show']);
    Route::get('hotels/{hotel}/rooms',      [HotelController::class, 'rooms']);
    Route::get('hotels/{hotel}/reviews',    [HotelController::class, 'reviews']);
    Route::get('rooms/{room}/availability', [RoomController::class, 'availability']);

    // ─── Authenticated routes ──────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('logout',          [AuthController::class, 'logout']);
            Route::get('me',               [AuthController::class, 'me']);
            Route::put('profile',          [AuthController::class, 'updateProfile']);
            Route::put('password',         [AuthController::class, 'changePassword']);
        });

        // Reservations (guest)
        Route::get('reservations',                      [ReservationController::class, 'index']);
        Route::post('reservations',                     [ReservationController::class, 'store']);
        Route::get('reservations/{reservation}',        [ReservationController::class, 'show']);
        Route::put('reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);

        // Reviews (guest)
        Route::post('hotels/{hotel}/reviews',  [ReviewController::class, 'store']);
        Route::put('reviews/{review}',         [ReviewController::class, 'update']);
        Route::delete('reviews/{review}',      [ReviewController::class, 'destroy']);

        // ─── Admin routes ──────────────────────────────────────────
        Route::middleware(AdminMiddleware::class)->prefix('admin')->group(function () {

            // Dashboard & Reports
            Route::get('dashboard',           [AdminDashboardController::class, 'index']);
            Route::get('reports',             [ReportController::class, 'index']);

            // Hotel management (original routes kept)
            Route::post('hotels',             [HotelController::class, 'store']);
            Route::put('hotels/{hotel}',      [HotelController::class, 'update']);
            Route::delete('hotels/{hotel}',   [HotelController::class, 'destroy']);

            // Admin hotels (list all + toggle)
            Route::get('hotels',                          [AdminHotelController::class, 'index']);
            Route::patch('hotels/{hotel}/toggle',         [AdminHotelController::class, 'toggle']);

            // Room management
            Route::post('hotels/{hotel}/rooms',           [RoomController::class, 'store']);
            Route::put('rooms/{room}',                    [RoomController::class, 'update']);
            Route::delete('rooms/{room}',                 [RoomController::class, 'destroy']);

            // Reservation management
            Route::get('reservations',                    [ReservationController::class, 'adminIndex']);
            Route::put('reservations/{reservation}',      [ReservationController::class, 'adminUpdate']);

            // User management
            Route::get('users',                           [AdminUserController::class, 'index']);
            Route::put('users/{user}',                    [AdminUserController::class, 'update']);
            Route::patch('users/{user}/toggle',           [AdminUserController::class, 'toggle']);
        });
    });
});
