<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'skill',
        'latitude',
        'description',
        'profile_image',
        'longitude',
        'contact'
    ];

    public function portfolioImages()
    {
        return $this->hasMany(PortfolioImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}

