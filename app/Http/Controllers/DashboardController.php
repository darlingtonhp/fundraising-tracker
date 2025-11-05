<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Mitupo;
use App\Models\Project;
use App\Models\FundDayContribution;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Base queries for different data types
        $contributionQuery = Contribution::query();
        $projectQuery = Project::query();
        $fundDayQuery = FundDayContribution::query();

        // Apply user-based filtering for all data types
        if ($user->role === 'user') {
            $contributionQuery->where('user_id', $user->id);
            $projectQuery->where('user_id', $user->id);
            $fundDayQuery->where('user_id', $user->id);
        }

        // Contributions Stats
        $totalContributions = $contributionQuery->count();
        $totalAmount = $contributionQuery->sum('total_contributed');
        $totalTshirts = $contributionQuery->sum('no_of_tshirts');
        $totalCementBags = $contributionQuery->sum('no_of_cement_bags');

        // Projects Stats
        $totalProjects = $projectQuery->count();
        $totalProjectCost = $projectQuery->sum('project_cost');
        $totalProjectRevenue = $projectQuery->sum('revenue');
        $totalProjectProfit = $projectQuery->sum('profit');

        // Fund Day Stats
        $totalFundDayContributions = $fundDayQuery->count();
        $totalFundDayAmount = $fundDayQuery->sum('total_contributed');
        $totalFundDayCementBags = $fundDayQuery->sum('cement_bags');

        // Combined Stats
        $combinedTotal = $totalAmount + $totalProjectProfit + $totalFundDayAmount;
        $totalRecords = $totalContributions + $totalProjects + $totalFundDayContributions;

        // Recent data with user filtering
        $recentContributionsQuery = Contribution::with(['mutupo', 'contributorType'])->latest();
        $recentProjectsQuery = Project::with('user')->latest();
        $recentFundDayQuery = FundDayContribution::with('user')->latest();

        if ($user->role === 'user') {
            $recentContributionsQuery->where('user_id', $user->id);
            $recentProjectsQuery->where('user_id', $user->id);
            $recentFundDayQuery->where('user_id', $user->id);
        }

        $recentContributions = $recentContributionsQuery->take(5)->get();
        $recentProjects = $recentProjectsQuery->take(5)->get();
        $recentFundDay = $recentFundDayQuery->take(5)->get();

        // Contributions by mutupo with user filtering
        $mutupoQuery = Mitupo::query();

        if ($user->role === 'user') {
            // For regular users, only show mutupos that have contributions from this user
            $mutupoQuery->whereHas('contributions', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }

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

        // Projects summary (top performing projects)
        $topProjects = $projectQuery
            ->orderBy('profit', 'desc')
            ->take(5)
            ->get(['name', 'profit', 'revenue', 'project_cost']);

        return Inertia::render('Dashboard', [
            'stats' => [
                // Combined Stats
                'combinedTotal' => (float) $combinedTotal,
                'totalRecords' => $totalRecords,
                
                // Contributions Stats
                'totalContributors' => $totalContributions,
                'totalAmount' => (float) $totalAmount,
                'totalTshirts' => $totalTshirts,
                'totalCementBags' => $totalCementBags,
                
                // Projects Stats
                'totalProjects' => $totalProjects,
                'totalProjectCost' => (float) $totalProjectCost,
                'totalProjectRevenue' => (float) $totalProjectRevenue,
                'totalProjectProfit' => (float) $totalProjectProfit,
                'projectProfitMargin' => $totalProjectRevenue > 0 ? ($totalProjectProfit / $totalProjectRevenue) * 100 : 0,
                
                // Fund Day Stats
                'totalFundDayContributions' => $totalFundDayContributions,
                'totalFundDayAmount' => (float) $totalFundDayAmount,
                'totalFundDayCementBags' => $totalFundDayCementBags,
            ],
            'recentContributions' => $recentContributions,
            'recentProjects' => $recentProjects,
            'recentFundDay' => $recentFundDay,
            'contributionsByMutupo' => $contributionsByMutupo,
            'topProjects' => $topProjects,
            'userRole' => $user->role,
            'canViewAll' => in_array($user->role, ['admin', 'general']),
        ]);
    }
}