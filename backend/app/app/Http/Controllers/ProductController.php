<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

use Illuminate\Support\Facades\Storage;

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

     // Метод для загрузки фото
     public function uploadImageProduct(Request $request)
    {
        $data = $request->validate([
            'image' => 'required|image|max:5120', // максимум 5 МБ
        ]);

        $path = $request->file('image')->store('images', 'public');

        // Явно задаём базовый адрес вашего бэкенда с портом
        $baseUrl = 'http://localhost:8000';

        // Формируем полный URL к файлу
        $fullUrl = $baseUrl . Storage::url($path);

        return response()->json(['url' => $fullUrl], 201);
    }


     // Метод для создания нового товара
     public function addProduct(Request $request)
     {
         $data = $request->validate([
             'name' => 'required|string|max:255',
             'price' => 'required|numeric|min:0',
             'image' => 'required|string|max:2048', // путь к фото 'color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'], // HEX цвет
         ]);

         $product = Product::create([
             'name' => $data['name'],
             'image' => $data['image'],
             'price' => $data['price'], //'color' => $data['color'],
             'rating' => 0,
             'seller_id' => 0,
         ]);

         return response()->json(['product' => $product], 201);
     }
}
