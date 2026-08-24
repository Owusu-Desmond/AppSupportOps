<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Redirect root to dashboard (auth middleware will automatically redirect unauthenticated guests to /login)
Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Daily Handover Dashboard (Index)
    Route::get('/dashboard', [ActivityController::class, 'index'])->name('dashboard');

    // Activity Input (Store) & Status Update (Update)
    Route::post('/activities', [ActivityController::class, 'store'])->name('activities.store');
    Route::patch('/activities/{activity}', [ActivityController::class, 'update'])->name('activities.update');

    // Historical Reporting (Report)
    Route::get('/reports', [ActivityController::class, 'report'])->name('activities.report');

    // User Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


