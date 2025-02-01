<?php

namespace App\Http\Controllers;

use App\Models\Artisan;
use Illuminate\Http\Request;

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

        // Find artisans within a 10km radius
        $artisans = $query->selectRaw("
            *, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) 
            * cos(radians(longitude) - radians(?)) + sin(radians(?)) 
            * sin(radians(latitude)))) AS distance", [
            $request->latitude,
            $request->longitude,
            $request->latitude
        ])
            ->having("distance", "<", 100000)
            ->orderBy("distance")
            ->get();

        return response()->json($artisans);
    }
}
