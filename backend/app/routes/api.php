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

Route::prefix('catalog')->group(function () {
    Route::get('', [\App\Http\Controllers\ProductController::class, 'index']);
    Route::get('{id}', [\App\Http\Controllers\ProductController::class, 'info']);
});



Route::prefix('cart')->group(function () {
Route::get('{id}',[App\Http\Controllers\CartController::class,'showCart']);
Route::delete('removal/{id}',[App\Http\Controllers\CartController::class,'removal']);
Route::put('increase/{id}',[App\Http\Controllers\CartController::class,'increase']);
Route::put('subtract/{id}',[App\Http\Controllers\CartController::class,'subtract']);
});


Route::post('/customer/register', [App\Http\Controllers\CustomerController::class, 'register']);
