<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

class CategoryController extends Controller
{
    public function index()
    {
        return [
            ['id' => 1, 'name' => 'Computers & Laptops'],
            ['id' => 2, 'name' => 'Smartphones & Tablets'],
            ['id' => 3, 'name' => 'Electronics'],
            ['id' => 4, 'name' => 'Gaming'],
            ['id' => 5, 'name' => 'Smart Home'],
            ['id' => 6, 'name' => 'Wearable Tech'],

        ];
    }
}
