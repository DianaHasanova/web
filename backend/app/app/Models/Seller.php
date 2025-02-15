<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sellers';
    protected $fillable = ['name', 'contact_info', 'description'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
