<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CatalogController extends Controller
{
    private function getProducts() {
        return [
            ['id' => 1, 'name' => 'iphone346', 'price' => 1500, 'category_id' => 1, 'description' => 'technic 1'],
            ['id' => 2, 'name' => 'xiome900', 'price' => 5000, 'category_id' => 1, 'description' => 'technic 2'],
            ['id' => 3, 'name' => 'acer8', 'price' => 3000,  'category_id' => 2, 'description' => 'technic 3'],
            ['id' => 4, 'name' => 'fnder444', 'price' => 500,  'category_id' => 3, 'description' => 'technic 4']
        ];
    }

    public function index()
    {
        return response()->json($this->getProducts());
    }

    public function show($id)
    {
        $product = collect($this->getProducts())->firstWhere('id', $id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($product);
    }
}
