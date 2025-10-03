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

    public function create()
    {
        return Inertia::render('Mitupos/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:mitupos',
            'description' => 'nullable|string',
        ]);

        Mitupo::create($request->all());

        return redirect()->route('mitupos.index')->with('success', 'Mutupo added successfully!');
    }

    public function edit(Mitupo $mitupo)
    {
        return Inertia::render('Mitupos/Edit', [
            'mitupo' => $mitupo,
        ]);
    }

    public function update(Request $request, Mitupo $mitupo)
    {
        $request->validate([
            'name' => 'required|string|unique:mitupos,name,' . $mitupo->id,
            'description' => 'nullable|string',
        ]);

        $mitupo->update($request->all());

        return redirect()->route('mitupos.index')->with('success', 'Mutupo updated successfully!');
    }

    public function destroy(Mitupo $mitupo)
    {
        $mitupo->delete();

        return redirect()->back()->with('success', 'Mutupo deleted successfully!');
    }
}
