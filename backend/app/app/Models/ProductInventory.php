<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductInventory extends Model
{
    protected $table = 'product_inventory';


    protected $fillable = ['product_id','size','stock_quantity'];


    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
