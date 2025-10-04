<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Mitupo;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Base query for contributions
        $contributionQuery = Contribution::query();

        // Apply user-based filtering
        // Admin and General users can see all contributions
        // Regular users can only see their own contributions
        if ($user->role === 'user') {
            $contributionQuery->where('user_id', $user->id);
        }

        $totalContributions = $contributionQuery->count();
        $totalAmount = $contributionQuery->sum('total_contributed');
        $totalTshirts = $contributionQuery->sum('no_of_tshirts');
        $totalCementBags = $contributionQuery->sum('no_of_cement_bags');

        // Recent contributions with user filtering
        $recentContributionsQuery = Contribution::with(['mutupo', 'contributorType'])
            ->latest();

        // Apply the same filtering for recent contributions
        if ($user->role === 'user') {
            $recentContributionsQuery->where('user_id', $user->id);
        }

        $recentContributions = $recentContributionsQuery->take(5)->get();

        // Contributions by mutupo with user filtering
        $mutupoQuery = Mitupo::query();

        if ($user->role === 'user') {
            // For regular users, only show mutupos that have contributions from this user
            $mutupoQuery->whereHas('contributions', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }
        // Admin and General users can see all mutupos with contributions

        $contributionsByMutupo = $mutupoQuery
            ->withCount([
                'contributions as total_contributors' => function ($query) use ($user) {
                    if ($user->role === 'user') {
                        $query->where('user_id', $user->id);
                    }
                }
            ])
            ->withSum([
                'contributions as total_amount' => function ($query) use ($user) {
                    if ($user->role === 'user') {
                        $query->where('user_id', $user->id);
                    }
                }
            ], 'total_contributed')
            ->having('total_contributors', '>', 0)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalContributors' => $totalContributions,
                'totalAmount' => (float) $totalAmount,
                'totalTshirts' => $totalTshirts,
                'totalCementBags' => $totalCementBags,
            ],
            'recentContributions' => $recentContributions,
            'contributionsByMutupo' => $contributionsByMutupo,
            'userRole' => $user->role, // Pass user role to frontend
            'canViewAll' => in_array($user->role, ['admin', 'general']), // Both admin and general can view all
        ]);
    }
}
