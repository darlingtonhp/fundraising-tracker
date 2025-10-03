<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\MitupoController;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(["auth", "verified"])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Reports routes 
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
    Route::post('/reports/export', [ReportController::class, 'export'])->name('reports.export');

    // Import/Export routes
    Route::post('/contributions/import', [ContributionController::class, 'import'])->name('contributions.import');
    Route::get('/contributions/export', [ContributionController::class, 'export'])->name('contributions.export');

    Route::get('/contributions/mitupo-data', [ContributionController::class, 'getMitupoData'])->name('contributions.mitupo-data');
    // Resource routes - should come LAST
    Route::resource('mitupos', MitupoController::class);
    Route::resource('contributions', ContributionController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
