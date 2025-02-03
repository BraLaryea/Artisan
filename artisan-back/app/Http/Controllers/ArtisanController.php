<?php

namespace App\Http\Controllers;

use App\Models\Artisan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArtisanController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'skill' => 'nullable|string',
        ]);

        $query = Artisan::query();

        if ($request->has('skill')) {
            $query->where('skill', 'LIKE', '%' . $request->skill . '%');
        }

        // Find artisans within a 10000km radius
        $artisans = $query->selectRaw("
            *, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) 
            * cos(radians(longitude) - radians(?)) + sin(radians(?)) 
            * sin(radians(latitude)))) AS distance", [
            $request->latitude,
            $request->longitude,
            $request->latitude
        ])
            ->having("distance", "<", 10000)
            ->orderBy("distance")
            ->get();

        return response()->json($artisans);
    }

    /**
     * Store a new artisan
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'required|string',
            'skill'         => 'required|string',
            'contact'        => 'required|string|max:15',
            'location'      => 'required|string',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'profilePicture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'portfolio.*'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        // Handle profile picture upload
        $profilePath = null;
        if ($request->hasFile('profilePicture')) {
            $profilePath = $request->file('profilePicture')->store('artisans/profiles', 'public');
        }

        // Handle portfolio images upload
        $portfolioPaths = [];
        if ($request->hasFile('portfolio')) {
            foreach ($request->file('portfolio') as $file) {
                $portfolioPaths[] = $file->store('artisans/portfolio', 'public');
            }
        }

        // Save artisan details
        $artisan = Artisan::create([
            'name'          => $request->name,
            'description'   => $request->description,
            'skill'         => $request->skill,
            'contact'        => $request->contact,
            'location'      => $request->location,
            'latitude'      => $request->latitude,
            'longitude'     => $request->longitude,
            'profile_picture' => $profilePath,
            'portfolio'     => json_encode($portfolioPaths),
        ]);

        return response()->json([
            'message' => 'Artisan created successfully!',
            'artisan' => $artisan
        ], 201);
    }
}

