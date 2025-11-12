<?php
// app/Http/Controllers/FundDayContributionController.php

namespace App\Http\Controllers;

use App\Models\FundDayContribution;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FundDayContributionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $contributions = FundDayContribution::with('user')
                ->latest()
                ->get();
        } else {
            $contributions = FundDayContribution::with('user')
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        return Inertia::render('FundDayContributions/Index', [
            'contributions' => $contributions,
            'permissions' => [
                'canEdit' => $user->role === 'admin',
                'canDelete' => $user->role === 'admin',
                'canCreate' => $user->role !== 'general',
                'canExport' => $user->role !== 'general',
            ]
        ]);
    }

    public function create()
    {
        if (Auth::user()->role === 'general') {
            return redirect()->route('fund-day-contributions.index')
                ->with('error', 'You do not have permission to create fund day contributions.');
        }

        return Inertia::render('FundDayContributions/Create');
    }

    public function store(Request $request)
    {
        if (Auth::user()->role === 'general') {
            return redirect()->route('fund-day-contributions.index')
                ->with('error', 'You do not have permission to create fund day contributions.');
        }

        $validated = $request->validate([
            'contributor_name' => 'required|string|max:255',
            'cement_bags' => 'required|integer|min:0',
            'cement_amount' => 'required|numeric|min:0',
        ]);

        // Calculate total contributed
        $validated['total_contributed'] = $validated['cement_amount'];
        $validated['user_id'] = Auth::id();

        FundDayContribution::create($validated);

        return redirect()->route('fund-day-contributions.index')
            ->with('success', 'Fund day contribution added successfully!');
    }

    public function edit(FundDayContribution $fundDayContribution)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('fund-day-contributions.index')
                ->with('error', 'You do not have permission to edit fund day contributions.');
        }

        $fundDayContribution->load('user');

        return Inertia::render('FundDayContributions/Edit', [
            'contribution' => $fundDayContribution
        ]);
    }

    public function update(Request $request, FundDayContribution $fundDayContribution)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('fund-day-contributions.index')
                ->with('error', 'You do not have permission to update fund day contributions.');
        }

        $validated = $request->validate([
            'contributor_name' => 'required|string|max:255',
            'cement_bags' => 'required|integer|min:0',
            'cement_amount' => 'required|numeric|min:0',
        ]);

        $validated['total_contributed'] = $validated['cement_amount'];

        $fundDayContribution->update($validated);

        return redirect()->route('fund-day-contributions.index')
            ->with('success', 'Fund day contribution updated successfully!');
    }

    public function destroy(FundDayContribution $fundDayContribution)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('fund-day-contributions.index')
                ->with('error', 'You do not have permission to delete fund day contributions.');
        }

        $fundDayContribution->delete();

        return redirect()->route('fund-day-contributions.index')
            ->with('success', 'Fund day contribution deleted successfully!');
    }

    public function export()
    {
        $user = Auth::user();

        // General users cannot export
        if ($user->role === 'general') {
            return redirect()->route('fund-day-contributions.index')
                ->with('error', 'You do not have permission to export fund day contributions.');
        }

        if ($user->role === 'admin') {
            $contributions = FundDayContribution::with('user')
                ->latest()
                ->get();
        } else {
            $contributions = FundDayContribution::with('user')
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        $filename = "fund_day_contributions_" . now()->format('Y-m-d_H-i-s') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($contributions) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for Excel compatibility
            fwrite($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv($file, [
                'Contributor Name',
                'Cement Bags',
                'Cement Amount',
                'Total Contribution',
                'Added By',
                'Created At'
            ]);

            // Data rows
            foreach ($contributions as $contribution) {
                fputcsv($file, [
                    $contribution->contributor_name,
                    $contribution->cement_bags,
                    $contribution->cement_amount,
                    $contribution->total_contributed,
                    $contribution->user->name,
                    $contribution->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
