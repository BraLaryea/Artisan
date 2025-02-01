<?php

namespace Database\Seeders;

use App\Models\Artisan;
use Illuminate\Database\Seeder;

class ArtisanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Artisan::create([
            'name' => 'John Doe',
            'skill' => 'Electrician',
            'latitude' => 5.6037,
            'longitude' => -0.1870, // Example: Accra, Ghana
        ]);

        Artisan::create([
            'name' => 'Jane Smith',
            'skill' => 'Plumber',
            'latitude' => 5.6145,
            'longitude' => -0.2050,
        ]);
    }
}
