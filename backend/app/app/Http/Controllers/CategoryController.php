<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::query()->select('id', 'name', 'slug', 'image')->get()
        );
    }
}
