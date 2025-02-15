<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function showCart($userId) {
        try {
            $cart = Cart::with('product')
                        ->where('user_id', $userId)
                        ->get();

            if ($cart->isEmpty()) {
                return response()->json([], 200);
            }

            $cartData = $cart->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'product' => $item->product ? [
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'image' => $item->product->image,
                    ] : null,
                ];
            })->toArray();


            return response()->json($cartData, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при получении данных корзины: ' . $e->getMessage()], 500);
        }
    }

    public function removal($id) {
        $cartItem = Cart::where('id', $id)->first();

        $cartItem->delete();
        return response()->json(['message' => 'Item removed successfully']);
    }

    public function increase($id)
    {
            $cartItem = Cart::with('product')->find($id);
            $cartItem->quantity += 1;
            $cartItem->save();

            return response()->json($cartItem, 200);
    }

    public function subtract($id)
    {
            $cartItem = Cart::with('product')->find($id);
            if ($cartItem->quantity !== 1)
            {
                $cartItem->quantity -= 1;
                $cartItem->save();
                return response()->json($cartItem, 200);
            } else{
                $cartItem->delete();
            }
    }



}

