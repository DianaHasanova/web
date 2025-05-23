<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Styles extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'styles';

    protected $fillable = ['name','product_id'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_categories');
    }



}
