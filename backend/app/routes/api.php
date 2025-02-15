<?php

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//Route::get('/catalog/{id}',[App\Http\Controllers\API\CatalogController::class,'show']);
//Route::get('/catalog',[App\Http\Controllers\API\CatalogController::class,'index']);
Route::get('/category',[App\Http\Controllers\API\CategoryController::class,'index']);

Route::prefix('catalog')->group(function () {
    Route::get('', [\App\Http\Controllers\ProductController::class, 'index']);
    Route::get('{id}', [\App\Http\Controllers\ProductController::class, 'info']);
});

/*
//Route::get('/cart/{id}',[App\Http\Controllers\CartController::class,'showCart']);
Route::get('/cart/{id}',[App\Http\Controllers\CartController::class,'showCart']);
Route::delete('/cart/removal/{id}',[App\Http\Controllers\CartController::class,'removal']);
Route::put('/cart/increase/{id}',[App\Http\Controllers\CartController::class,'increase']);
Route::put('/cart/subtract/{id}',[App\Http\Controllers\CartController::class,'subtract']);
*/

Route::prefix('cart')->group(function () {
Route::get('{id}',[App\Http\Controllers\CartController::class,'showCart']);
Route::delete('removal/{id}',[App\Http\Controllers\CartController::class,'removal']);
Route::put('increase/{id}',[App\Http\Controllers\CartController::class,'increase']);
Route::put('subtract/{id}',[App\Http\Controllers\CartController::class,'subtract']);
});


Route::post('/customer/register', [App\Http\Controllers\CustomerController::class, 'register']);
