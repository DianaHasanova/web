<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    public function index()
    {
        return Product::query()->get();
    }

    public function info($id)
    {
        return Product::query()
            ->where('id', $id)
            ->first();
    }

    public function getProductsByCategory($slug)
    {
        $categoryId = Category::where('slug', $slug)->value('id');

        if (!$categoryId) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $products = Product::whereHas('categories', function ($query) use ($categoryId) {
            $query->where('category_id', $categoryId);
        })->get();

        $categoryName = Category::find($categoryId)->name;

        return response()->json([
            'categoryName' => $categoryName,
            'products' => $products->toArray(),
        ]);
    }
}
