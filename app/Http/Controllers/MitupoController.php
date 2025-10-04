<?php
// app/Http/Controllers/MitupoController.php

namespace App\Http\Controllers;

use App\Models\Mitupo;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MitupoController extends Controller
{
    public function index()
    {
        return Inertia::render('Mitupos/Index', [
            'mitupos' => Mitupo::latest()->get(),
        ]);
    }

    public function create(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action. Only administrators can add mitupo.');
        }
        return Inertia::render('Mitupos/Create');
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action. Only administrators can add mitupo.');
        }
        $request->validate([
            'name' => 'required|string|unique:mitupos',
            'description' => 'nullable|string',
        ]);

        Mitupo::create($request->all());

        return redirect()->route('mitupos.index')->with('success', 'Mutupo added successfully!');
    }

    public function edit(Request $request, Mitupo $mitupo)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action. Only administrators can edit mitupo.');
        }
        return Inertia::render('Mitupos/Edit', [
            'mitupo' => $mitupo,
        ]);
    }

    public function update(Request $request, Mitupo $mitupo)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action. Only administrators can update mitupo.');
        }
        $request->validate([
            'name' => 'required|string|unique:mitupos,name,' . $mitupo->id,
            'description' => 'nullable|string',
        ]);

        $mitupo->update($request->all());

        return redirect()->route('mitupos.index')->with('success', 'Mutupo updated successfully!');
    }

    public function destroy(Request $request, Mitupo $mitupo)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action. Only administrators can delete accounts.');
        }
        $mitupo->delete();

        return redirect()->back()->with('success', 'Mutupo deleted successfully!');
    }
}
