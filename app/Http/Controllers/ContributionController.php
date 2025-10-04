<?php
// app/Http/Controllers/ContributionController.php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Mitupo;
use App\Models\ContributorType;
use App\Http\Requests\StoreContributionRequest;
use App\Http\Requests\UpdateContributionRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Exception;

class ContributionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Permission logic for different roles
        if ($user->role === 'admin') {
            $contributions = Contribution::with(['mutupo', 'contributorType', 'user'])
                ->latest()
                ->get();
        } else if ($user->role === 'general') {
            // General users can view all contributions but only view
            $contributions = Contribution::with(['mutupo', 'contributorType', 'user'])
                ->latest()
                ->get();
        } else {
            // Regular users can only view their own contributions
            $contributions = Contribution::with(['mutupo', 'contributorType', 'user'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        return Inertia::render('Contributions/Index', [
            'contributions' => $contributions,
            'permissions' => [
                'canEdit' => $user->role === 'admin',
                'canDelete' => $user->role === 'admin',
                'canImport' => $user->role === 'admin',
                'canCreate' => $user->role !== 'general', // General users cannot create
                'canViewAll' => in_array($user->role, ['admin', 'general']), // Both admin and general can view all
            ]
        ]);
    }

    public function create()
    {
        // Check if user is general (cannot create)
        if (Auth::user()->role === 'general') {
            return redirect()->route('contributions.index')
                ->with('error', 'You do not have permission to create contributions.');
        }

        return Inertia::render('Contributions/Create', [
            'mitupos' => Mitupo::all(),
            'contributorTypes' => ContributorType::all(),
        ]);
    }

    public function store(StoreContributionRequest $request)
    {
        // Check if user is general (cannot create)
        if (Auth::user()->role === 'general') {
            return redirect()->route('contributions.index')
                ->with('error', 'You do not have permission to create contributions.');
        }

        Contribution::create($request->validated());

        return redirect()->route('contributions.index')
            ->with('success', 'Contribution added successfully!');
    }

    public function edit(Contribution $contribution)
    {
        // Check if user is admin (only admin can edit)
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('contributions.index')
                ->with('error', 'You do not have permission to edit contributions.');
        }
        return Inertia::render('Contributions/Edit', [
            'contribution' => $contribution->load(['mutupo', 'contributorType']),
            'mitupos' => Mitupo::all(),
            'contributorTypes' => ContributorType::all(),
        ]);
    }

    public function update(UpdateContributionRequest $request, Contribution $contribution)
    {
        // Check if user is admin (only admin can update)
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('contributions.index')
                ->with('error', 'You do not have permission to update contributions.');
        }
        $contribution->update($request->validated());

        return redirect()->route('contributions.index')
            ->with('success', 'Contribution updated successfully!');
    }

    public function destroy(Contribution $contribution)
    {
        // Check if user is admin (only admin can delete)
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('contributions.index')
                ->with('error', 'You do not have permission to delete contributions.');
        }
        $contribution->delete();

        return redirect()->route('contributions.index')
            ->with('success', 'Contribution deleted successfully!');
    }

    public function import(Request $request)
    {
        // Check if user is admin (only admin can import)
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('contributions.index')
                ->with('error', 'You do not have permission to import contributions.');
        }

        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240'
        ]);

        try {
            $file = $request->file('csv_file');
            $csvData = array_map('str_getcsv', file($file));
            $headers = array_shift($csvData); // Remove header row

            $importedCount = 0;
            $errors = [];

            foreach ($csvData as $rowIndex => $row) {
                if (count($row) !== count($headers)) {
                    $errors[] = "Row " . ($rowIndex + 2) . ": Incorrect number of columns";
                    continue;
                }

                $data = array_combine($headers, $row);

                // Validate required fields
                $validator = Validator::make($data, [
                    'contributor_name' => 'required|string|unique:contributions',
                    'mutupo_id' => 'required|exists:mitupos,id',
                    'contributor_type_id' => 'required|exists:contributor_types,id',
                    'no_of_tshirts' => 'required|integer|min:0',
                    'no_of_cement_bags' => 'required|integer|min:0',
                    'cement_amount' => 'required|numeric|min:0',
                ]);

                if ($validator->fails()) {
                    $errors[] = "Row " . ($rowIndex + 2) . ": " . implode(', ', $validator->errors()->all());
                    continue;
                }

                try {
                    Contribution::create([
                        'contributor_name' => $data['contributor_name'],
                        'mutupo_id' => $data['mutupo_id'],
                        'contributor_type_id' => $data['contributor_type_id'],
                        'no_of_tshirts' => $data['no_of_tshirts'],
                        'no_of_cement_bags' => $data['no_of_cement_bags'],
                        'cement_amount' => $data['cement_amount'],
                    ]);

                    $importedCount++;
                } catch (Exception $e) {
                    $errors[] = "Row " . ($rowIndex + 2) . ": " . $e->getMessage();
                }
            }

            $message = "Successfully imported {$importedCount} contributions.";
            if (!empty($errors)) {
                $message .= " Errors: " . implode('; ', array_slice($errors, 0, 5));
                if (count($errors) > 5) {
                    $message .= " and " . (count($errors) - 5) . " more errors.";
                }
                return redirect()->route('contributions.index')->with('warning', $message);
            }

            return redirect()->route('contributions.index')->with('success', $message);
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }

    public function export()
    {
        $user = Auth::user();

        // General users cannot export
        if ($user->role === 'general') {
            return redirect()->route('contributions.index')
                ->with('error', 'You do not have permission to export contributions.');
        }

        if ($user->role === 'admin') {
            $contributions = Contribution::with(['mutupo', 'contributorType'])
                ->latest()
                ->get();
        } else {
            $contributions = Contribution::with(['mutupo', 'contributorType'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        $filename = "contributions_" . now()->format('Y-m-d_H-i-s') . ".csv";

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
                'Mutupo',
                'Contributor Type',
                'Number of T-Shirts',
                'T-Shirt Amount',
                'Number of Cement Bags',
                'Cement Amount',
                'Total Contribution'
            ]);

            // Data rows
            foreach ($contributions as $contribution) {
                fputcsv($file, [
                    $contribution->contributor_name,
                    $contribution->mutupo->name,
                    $contribution->contributorType->name,
                    $contribution->no_of_tshirts,
                    $contribution->tshirt_amount,
                    $contribution->no_of_cement_bags,
                    $contribution->cement_amount,
                    $contribution->total_contributed
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    // Helper method to get mitupo IDs for the template
    public function getMitupoData()
    {
        // General users cannot access this
        if (Auth::user()->role === 'general') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $mitupos = Mitupo::all()->map(function ($mitupo) {
            return [
                'id' => $mitupo->id,
                'name' => $mitupo->name,
                'description' => $mitupo->description,
            ];
        });

        return response()->json([
            'mitupos' => $mitupos,
            'contributor_types' => [
                ['id' => 1, 'name' => 'External Guest'],
                ['id' => 2, 'name' => 'Internal Guest'],
                ['id' => 3, 'name' => 'Fundraising Task Force Member'],
            ]
        ]);
    }
}