<?php

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/category',[App\Http\Controllers\CategoryController::class,'index']);
//Route::get('/products/by-category/{slug}', [ProductController::class, 'getProductsByCategory']);

Route::prefix('catalog')->group(function () {
    Route::get('', [\App\Http\Controllers\ProductController::class, 'index']);
    Route::get('by-category/{slug}', [\App\Http\Controllers\ProductController::class, 'getProductsByCategory']);
    Route::get('{id}', [\App\Http\Controllers\ProductController::class, 'info']);
});

//Route::get('products/by-category/{slug}', [\App\Http\Controllers\ProductController::class, 'getProductsByCategory']);
/*
Route::prefix('catalog')->group(function () {
    Route::get('', [\App\Http\Controllers\ProductController::class, 'index']);
    Route::get('{id}', [\App\Http\Controllers\ProductController::class, 'info']);
});
*/


Route::prefix('cart')->group(function () {
Route::get('', [App\Http\Controllers\CartController::class, 'showCart']);
//Route::get('{id}',[App\Http\Controllers\CartController::class,'showCart']);
Route::delete('removal/{id}',[App\Http\Controllers\CartController::class,'removal']);
Route::put('increase/{id}',[App\Http\Controllers\CartController::class,'increase']);
Route::put('subtract/{id}',[App\Http\Controllers\CartController::class,'subtract']);
Route::post('add/{product_id}', [App\Http\Controllers\CartController::class, 'addToCart']);
});


Route::prefix('customer')->group(function () {
Route::post('register', [App\Http\Controllers\CustomerController::class, 'register']);
Route::post('login', [App\Http\Controllers\CustomerController::class, 'login']);
Route::get('showProfile', [App\Http\Controllers\CustomerController::class, 'showProfile']);
Route::post('color-type', [App\Http\Controllers\CustomerController::class, 'updateColorType']);
});



Route::prefix('admin')->group(function () {
    Route::post('/add-product', [App\Http\Controllers\ProductController::class, 'addProduct']);
    Route::post('/upload-image', [App\Http\Controllers\ProductController::class, 'uploadImageProduct']);
});

Route::prefix('recommendation')->group(function () {
    Route::get('/user-purchases',[App\Http\Controllers\RecommendationController::class,'showUserPurchases']);
    Route::get('/cart',[App\Http\Controllers\RecommendationController::class,'showCart']);

});

Route::get('/available-products',[App\Http\Controllers\RecommendationController::class,'getAvailableProducts']);
Route::get('/test-recommendations', [App\Http\Controllers\RecommendationController::class, 'recommendationsForUser']);

Route::get('/styles', [App\Http\Controllers\ProductController::class, 'getStyles']);
Route::post('/admin/product-style', [App\Http\Controllers\ProductController::class, 'addProductStyles']);

Route::get('/categories', [App\Http\Controllers\ProductController::class, 'getCategories']);
Route::post('/admin/product-categories', [App\Http\Controllers\ProductController::class, 'addProductCategories']);
