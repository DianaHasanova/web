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

    protected $fillable = ['name', 'image', 'price', 'seller_id', 'rating', 'color_type','style_id' ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    public function styles()
{
    return $this->belongsToMany(Styles::class, 'product_style', 'product_id', 'style_id');
}

    /*
    public function styles()
    {
        return $this->belongsTo(Styles::class, 'style_id');
    }
        */

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /** потом рейтинг переделать с использованием этой функции при добавлении отзывов */
    public function getRatingAttribute()
    {
        $averageRating = $this->reviews()->avg('rating');
        return $averageRating ?: 0;
    }

}
