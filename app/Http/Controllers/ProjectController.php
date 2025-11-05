<?php
// app/Http/Controllers/ProjectController.php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $projects = Project::with('user')
                ->latest()
                ->get();
        } else {
            $projects = Project::with('user')
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
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
            return redirect()->route('projects.index')
                ->with('error', 'You do not have permission to create projects.');
        }

        return Inertia::render('Projects/Create');
    }

    public function store(Request $request)
    {
        if (Auth::user()->role === 'general') {
            return redirect()->route('projects.index')
                ->with('error', 'You do not have permission to create projects.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_cost' => 'required|numeric|min:0',
            'revenue' => 'required|numeric|min:0',
        ]);

        // Calculate profit
        $validated['profit'] = $validated['revenue'] - $validated['project_cost'];
        $validated['user_id'] = Auth::id();

        Project::create($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project added successfully!');
    }

    public function edit(Project $project)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('projects.index')
                ->with('error', 'You do not have permission to edit projects.');
        }

        return Inertia::render('Projects/Edit', [
            'project' => $project
        ]);
    }

    public function update(Request $request, Project $project)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('projects.index')
                ->with('error', 'You do not have permission to update projects.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_cost' => 'required|numeric|min:0',
            'revenue' => 'required|numeric|min:0',
        ]);

        $validated['profit'] = $validated['revenue'] - $validated['project_cost'];

        $project->update($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully!');
    }

    public function destroy(Project $project)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('projects.index')
                ->with('error', 'You do not have permission to delete projects.');
        }

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully!');
    }

    public function export()
    {
        $user = Auth::user();

        // General users cannot export
        if ($user->role === 'general') {
            return redirect()->route('projects.index')
                ->with('error', 'You do not have permission to export projects.');
        }

        if ($user->role === 'admin') {
            $projects = Project::with('user')
                ->latest()
                ->get();
        } else {
            $projects = Project::with('user')
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        $filename = "projects_" . now()->format('Y-m-d_H-i-s') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($projects) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for Excel compatibility
            fwrite($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv($file, [
                'Project Name',
                'Description',
                'Project Cost',
                'Revenue',
                'Profit',
                'Added By',
                'Created At'
            ]);

            // Data rows
            foreach ($projects as $project) {
                fputcsv($file, [
                    $project->name,
                    $project->description ?? '',
                    $project->project_cost,
                    $project->revenue,
                    $project->profit,
                    $project->user->name,
                    $project->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
