<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'artisan_id',
    ];

    // Relationship to Artisan
    public function artisan(): BelongsTo
    {
        return $this->belongsTo(Artisan::class, 'artisan_id');
    }
}
