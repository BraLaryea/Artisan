<?php

namespace App\Http\Controllers;

use App\Models\Artisan;
use App\Models\PortfolioImage;
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

    public function details(Request $request, $artisanId)
    {
        $artisan = Artisan::with('portfolioImages')->find($artisanId);

        if (!$artisan) {
            return response()->json(['error' => 'Artisan not found'], 404);
        }

        // List of locations with coordinates
        $locations = [
            "Abetifi" => ['latitude' => 6.6713, 'longitude' => -0.7462],
            "Pepease" => ['latitude' => 6.6927, 'longitude' => -0.7366],
            "Nkwatia" => ['latitude' => 6.6285, 'longitude' => -0.7366],
            "Asakraka" => ['latitude' => 6.6286, 'longitude' => -0.6892],
            "Mpraeso" => ['latitude' => 6.6059, 'longitude' => -0.7117],
            "Bokuruwa" => ['latitude' => 6.6702, 'longitude' => -0.6945],
        ];

        // Default location name if no match is found
        $artisan->location = "Unknown";

        // Check which location matches the artisan's lat/lng
        foreach ($locations as $name => $coords) {
            if (
                number_format($artisan->latitude, 4) == number_format($coords['latitude'], 4) &&
                number_format($artisan->longitude, 4) == number_format($coords['longitude'], 4)
            ) {
                $artisan->location = $name;
                break;
            }
        }

        return response()->json($artisan);
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
            'contact'       => 'required|string|max:15',
            'location'      => 'required|string',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'profilePicture' => 'nullable|image|mimes:jpg,jpeg,png',
            'portfolio.*'   => 'nullable|image|mimes:jpg,jpeg,png'
        ]);

        // Define the locations and their coordinates
        $locations = [
            "Abetifi" => ['latitude' => 6.6713, 'longitude' => -0.7462],
            "Pepease" => ['latitude' => 6.6927, 'longitude' => -0.7366],
            "Nkwatia" => ['latitude' => 6.6285, 'longitude' => -0.7366],
            "Asakraka" => ['latitude' => 6.6286, 'longitude' => -0.6892],
            "Mpraeso" => ['latitude' => 6.6059, 'longitude' => -0.7117],
            "Bokuruwa" => ['latitude' => 6.6702, 'longitude' => -0.6945],
        ];

        // Assign latitude and longitude based on location
        $location = $request->location;
        $latitude = $request->latitude;
        $longitude = $request->longitude;

        if (isset($locations[$location])) {
            $latitude = $locations[$location]['latitude'];
            $longitude = $locations[$location]['longitude'];
        }

        // Handle profile picture upload
        $profilePath = null;
        if ($request->hasFile('profilePicture')) {
            $profilePath = 'http://localhost:8000/storage/' . $request->file('profilePicture')->store('artisans/profiles', 'public');
        }

        // Save artisan details
        $artisan = Artisan::create([
            'name'          => $request->name,
            'description'   => $request->description,
            'skill'         => $request->skill,
            'contact'       => $request->contact,
            'location'      => $location,
            'latitude'      => $latitude,
            'longitude'     => $longitude,
            'profile_image' => $profilePath,
        ]);

        // Handle portfolio images upload and save them in the PortfolioImage table
        if ($request->hasFile('portfolio')) {
            foreach ($request->file('portfolio') as $file) {
                $path = 'http://localhost:8000/storage/' . $file->store('artisans/portfolio', 'public');

                // Create portfolio image record
                PortfolioImage::create([
                    'image' => $path,
                    'artisan_id' => $artisan->id,
                ]);
            }
        }

        return response()->json([
            'message' => 'Artisan created successfully!',
            'artisan' => $artisan
        ], 201);
    }
}
