<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product';

    protected $fillable = ['name', 'image', 'price', 'seller_id'];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getRatingAttribute()
    {
        $averageRating = $this->reviews()->avg('rating');
        return $averageRating ?: 0;
    }

}
