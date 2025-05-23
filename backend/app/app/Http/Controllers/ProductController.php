<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Styles;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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




    // попробовать в докере права доступа открыть перед тем как пересобрать образы может тогда заработает с сохранением в voluems
     // Метод для загрузки фото
    public function uploadImageProductForDocker(Request $request)
{
    $data = $request->validate([
        'image' => 'required|image|max:5120', // максимум 5 МБ
    ]);

    if (!$request->hasFile('image')) {
        return response()->json(['error' => 'Файл не загружен'], 400);
    }

    $file = $request->file('image');

    if (!$file->isValid()) {
        return response()->json(['error' => 'Ошибка загрузки файла'], 400);
    }

    $path = $file->store('images', 'public');

    if (!$path) {
        return response()->json(['error' => 'Не удалось сохранить файл'], 500);
    }

    $baseUrl = 'http://localhost';
    $fullUrl = $baseUrl . Storage::url($path);

    return response()->json(['url' => $fullUrl], 201);
}


public function uploadImageProduct(Request $request)
{
    $data = $request->validate([
        'image' => 'required|image|max:5120',
    ]);

    if (!$request->hasFile('image')) {
        return response()->json(['error' => 'Файл не загружен'], 400);
    }

    $file = $request->file('image');

    if (!$file->isValid()) {
        return response()->json(['error' => 'Ошибка загрузки файла'], 400);
    }

    $destinationPath = 'images';

    $filename = uniqid() . '.' . $file->getClientOriginalExtension();

    try {
        $file->move($destinationPath, $filename);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Не удалось сохранить файл: ' . $e->getMessage()], 500);
    }

    $baseUrl = 'http://localhost';
    $fullUrl = $baseUrl . '/images/' . $filename; // Измените этот путь, если необходимо

    return response()->json(['url' => $fullUrl], 201);
}

     // Метод для создания нового товара
     public function addProduct1(Request $request)
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
             'seller_id' => 1,
         ]);

         return response()->json(['product' => $product], 201);
     }

    public function addProduct(Request $request)
{
    try {
        $product = Product::create([
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'image' => $request->input('image'),
            'color_type' => $request->input('colorType'),
            'rating' => 1,
            'seller_id' => 1,
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Ошибка при сохранении товара: ' . $e->getMessage()], 500);
    }


    return response()->json(['product' => $product], 201);
}

public function getStyles()
{
    $styles  = Styles::query()->get(); // выбираем нужные поля
    return response()->json($styles);
}


public function addProductStyles(Request $request)
{
    $data = $request->validate([
        // Указываем таблицу 'product' вместо 'products'
        'product_id' => 'required|exists:product,id',
        'style_ids' => 'required|array',
        'style_ids.*' => 'exists:styles,id', // предполагаем, что таблица стилей называется 'styles'
    ]);

    // Загружаем товар
    $product = Product::where('id', $data['product_id'])->first();

    if (!$product) {
        return response()->json(['error' => 'Товар не найден'], 404);
    }

    // Получаем текущие связанные style_id
    $existingStyleIds = $product->styles()->pluck('styles.id')->toArray();

    // Фильтруем новые style_id, чтобы не дублировать
    $newStyleIds = array_diff($data['style_ids'], $existingStyleIds);

    if (empty($newStyleIds)) {
        return response()->json(['message' => 'Новых стилей для добавления нет'], 200);
    }

    try {
        $product->styles()->attach($newStyleIds);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Ошибка при добавлении стилей: ' . $e->getMessage()], 500);
    }

    return response()->json(['message' => 'Стили успешно добавлены']);
}

public function getCategories()
{
    $styles  = Category::query('id', 'name')->get();
    return response()->json($styles);
}


public function addProductCategories(Request $request)
{
    $data = $request->validate([
        // Валидация с указанием правильных таблиц
        'product_id' => 'required|exists:product,id',
        'category_ids' => 'required|array',
        'category_ids.*' => 'exists:categories,id',
    ]);

    $product = Product::where('id', $data['product_id'])->first();

    if (!$product) {
        return response()->json(['error' => 'Товар не найден'], 404);
    }

    $existingCategoryIds = $product->categories()->pluck('categories.id')->toArray();

    $newCategoryIds = array_diff($data['category_ids'], $existingCategoryIds);

    if (empty($newCategoryIds)) {
        return response()->json(['message' => 'Новых категорий для добавления нет'], 200);
    }

    try {
        $product->categories()->attach($newCategoryIds);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Ошибка при добавлении категорий: ' . $e->getMessage()], 500);
    }

    return response()->json(['message' => 'Категории успешно добавлены']);
}


}
