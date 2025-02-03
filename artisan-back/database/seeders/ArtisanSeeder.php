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
            'contact' => '0244812322',
            'description' => 'the game one',
            'latitude' => 5.6037,
            'longitude' => -0.1870,
        ]);

        Artisan::create([
            'name' => 'Jane Smith',
            'skill' => 'Plumber',
            'contact' => '0504812300',
            'description' => 'the game one',
            'latitude' => 5.6145,
            'longitude' => -0.2050,
        ]);
    }
}
