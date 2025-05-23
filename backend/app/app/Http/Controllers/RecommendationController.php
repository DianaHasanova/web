<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;


use App\Models\Product; //-----------
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;

use App\Models\ProductInventory;
use App\Models\Order;
use App\Models\Orders;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

use App\Services\RecommendationService;


class RecommendationController extends Controller
{
    protected RecommendationService $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }
    public function recommendationsForUser1(Request $request)
    {
        try {
            // Получаем ID пользователя из токена
            $userId = JWTAuth::parseToken()->getPayload()->get('sub');

            // Получаем color_type пользователя
            $userColorType = Customer::where('id', $userId)->value('color_type'); // например, "2"

            // Загружаем товары из корзины пользователя с категориями и стилями
            $cartItems = Cart::with(['product.categories', 'product.styles'])
                ->where('user_id', $userId)
                ->get();

            // Загружаем товары из заказов пользователя с категориями и стилями
            $orderItems = Orders::with(['product.categories', 'product.styles'])
                ->where('user_id', $userId)
                ->get();

            $userInteractions = [];

            // Добавляем взаимодействия из заказов (purchase)
            foreach ($orderItems as $item) {
                if (!$item->product) {
                    continue; // на случай, если товар удалён
                }

                $userInteractions[] = [
                    'category_ids' => $item->product->categories->pluck('id')->toArray(),
                    'style_ids' => $item->product->styles->pluck('id')->toArray(),
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'type' => 'purchase',
                ];
            }

            // Добавляем взаимодействия из корзины (cart)
            foreach ($cartItems as $item) {
                if (!$item->product) {
                    continue;
                }

                $userInteractions[] = [
                    'category_ids' => $item->product->categories->pluck('id')->toArray(),
                    'style_ids' => $item->product->styles->pluck('id')->toArray(),
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'type' => 'cart',
                ];
            }

            // Веса для разных типов взаимодействий
            $weights = [
                'purchase' => 1.0,
                'cart' => 0.5,
            ];

            // Формируем профиль пользователя
            $userProfile = $this->recommendationService->buildUserProfile($userInteractions, $weights);

            // Загружаем товары для рекомендаций из ProductInventory с категориями и стилями
            $productsQuery = ProductInventory::with(['product.categories', 'product.styles'])
            ->where('stock_quantity', '>', 0)
            ->whereHas('product', function ($query) use ($userColorType) {
                $query->whereRaw("FIND_IN_SET(?, REPLACE(color_type, ' ', ',')) > 0", [$userColorType]);
            });

        $products = $productsQuery->get()->map(function ($item) {
            $product = $item->product;

            return [
                'id' => $product->id,
                'category' => $this->recommendationService->oneHotEncode(
                    $this->recommendationService->allCategoryIds,
                    $product->categories->pluck('id')->toArray()
                ),
                'style' => $this->recommendationService->oneHotEncode(
                    $this->recommendationService->allStyleIds,
                    $product->styles->pluck('id')->toArray()
                ),
                'size' => $this->recommendationService->normalizeSize($item->size),
            ];
        })->toArray();

            // Получаем рекомендации (топ 20)
            $recommendations = $this->recommendationService->recommend($userProfile, $products, 20);

            //убираем дубликаты по id
            $uniqueRecommendations = [];
        $ids = [];

        foreach ($recommendations as $rec) {
            if (!in_array($rec['id'], $ids)) {
                $uniqueRecommendations[] = $rec;
                $ids[] = $rec['id'];
            }
        }

            return response()->json([
                'userInteractions' => $userInteractions,
                'userProfile' => $userProfile,
                'recommendations' => $uniqueRecommendations,//'recommendations' => $recommendations,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при формировании рекомендаций: ' . $e->getMessage()], 500);
        }
    }

    public function recommendationsForUser(Request $request)
{
    try {
        // Получаем ID пользователя из токена
        $userId = JWTAuth::parseToken()->getPayload()->get('sub');

        // Получаем color_type пользователя
        $userColorType = Customer::where('id', $userId)->value('color_type');

        // Загружаем данные из корзины и заказов
        $cartItems = Cart::with(['product.categories', 'product.styles'])
            ->where('user_id', $userId)
            ->get();

        $orderItems = Orders::with(['product.categories', 'product.styles'])
            ->where('user_id', $userId)
            ->get();

        // Формируем массив взаимодействий
        $userInteractions = [];

        // Обработка заказов
        foreach ($orderItems as $item) {
            if ($item->product) {
                $userInteractions[] = [
                    'category_ids' => $item->product->categories->pluck('id')->toArray(),
                    'style_ids' => $item->product->styles->pluck('id')->toArray(),
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'type' => 'purchase',
                ];
            }
        }

        // Обработка корзины
        foreach ($cartItems as $item) {
            if ($item->product) {
                $userInteractions[] = [
                    'category_ids' => $item->product->categories->pluck('id')->toArray(),
                    'style_ids' => $item->product->styles->pluck('id')->toArray(),
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'type' => 'cart',
                ];
            }
        }

        // Веса взаимодействий
        $weights = [
            'purchase' => 1.0,
            'cart' => 0.5,
        ];

        // Строим профиль пользователя
        $userProfile = $this->recommendationService->buildUserProfile($userInteractions, $weights);

        // Загружаем и фильтруем товары
        $products = ProductInventory::with(['product.categories', 'product.styles'])
            ->where('stock_quantity', '>', 0)
            ->whereHas('product', function ($query) use ($userColorType) {
                $query->whereRaw("FIND_IN_SET(?, REPLACE(color_type, ' ', ',')) > 0", [$userColorType]);
            })
            ->get()
            ->map(function ($item) {
                $product = $item->product;

                return [
                    'id' => $product->id,
                    'category' => $this->recommendationService->oneHotEncode(
                        $this->recommendationService->allCategoryIds,
                        $product->categories->pluck('id')->toArray()
                    ),
                    'style' => $this->recommendationService->oneHotEncode(
                        $this->recommendationService->allStyleIds,
                        $product->styles->pluck('id')->toArray()
                    ),
                    'size' => $this->recommendationService->normalizeSize($item->size),
                    'product' => $product // Ключевое добавление
                ];
            })->toArray();

        // Получаем рекомендации
        $recommendations = $this->recommendationService->recommend($userProfile, $products, 20);

        // Удаляем дубликаты
        $uniqueRecommendations = [];
        $ids = [];
        foreach ($recommendations as $rec) {
            if (!in_array($rec['id'], $ids)) {
                $uniqueRecommendations[] = $rec;
                $ids[] = $rec['id'];
            }
        }

        // Формируем финальный ответ
        $cleanRecommendations = array_map(function($rec) {
            $product = $rec['product'];
            return [
                'id' => $rec['id'],
                'name' => $product->name ?? null,
                'price' => $product->price ?? null,
                'image' => $product->image ?? null,
                'rating' => $product->rating ?? null,
                'categories' => $product->categories->pluck('name')->toArray() ?? [],
                'styles' => $product->styles->pluck('name')->toArray() ?? [],
                'similarity' => $rec['similarity'] ?? null,
                'size' => $rec['size'] ?? null,
            ];
        }, $uniqueRecommendations);

        return response()->json([
            'userInteractions' => $userInteractions,
            'userProfile' => $userProfile,
            'recommendations' => $cleanRecommendations
        ]);

    } catch (\Exception $e) {
        return response()->json(
            ['error' => 'Ошибка при формировании рекомендаций: ' . $e->getMessage()],
            500
        );
    }
}






































    public function testRecommendations(Request $request)
{
    $userInteractions = [
        [
            'category_ids' => [1, 2],
            'style_ids' => [3],
            'size' => 34,
            'quantity' => 1,
            'type' => 'purchase',
        ],
        [
            'category_ids' => [2],
            'style_ids' => [4],
            'size' => 36,
            'quantity' => 2,
            'type' => 'cart',
        ],
    ];

    $weights = [
        'purchase' => 1.0,
        'cart' => 0.5,
    ];

    $userProfile = $this->recommendationService->buildUserProfile($userInteractions, $weights);

    $products = ProductInventory::with(['product.categories', 'product.styles'])
        ->where('stock_quantity', '>', 0)
        ->get()
        ->map(function ($item) {
            $product = $item->product;

            return [
                'id' => $product->id,
                'category' => $this->recommendationService->oneHotEncode(
                    $this->recommendationService->allCategoryIds,
                    $product->categories->pluck('id')->toArray()
                ),
                'style' => $this->recommendationService->oneHotEncode(
                    $this->recommendationService->allStyleIds,
                    $product->styles->pluck('id')->toArray()
                ),
                'size' => $this->recommendationService->normalizeSize($item->size),
            ];
        })->toArray();

    $recommendations = $this->recommendationService->recommend($userProfile, $products, 21);

    return response()->json([
        'userInteractions' => $userInteractions,
        'userProfile' => $userProfile,
        'recommendations' => $recommendations,
    ]);
}

    public function getAvailableProducts()
{
    $products = ProductInventory::with([
        'product' => function ($query) {
            $query->with(['categories', 'styles']);
        }
    ])
    ->where('stock_quantity', '>', 0)
    ->get()
    ->map(function ($item) {
        return [
            'product_id' => $item->product_id,
            'size' => $item->size,
            'stock_quantity' => $item->stock_quantity,
            'product' => [
                'name' => $item->product->name,
                'categories' => $item->product->categories->pluck('name')->toArray(),
                'styles' => $item->product->styles->pluck('name')->toArray(),
            ],
        ];
    })
    ->toArray();

    return response()->json($products, 200);
}

public function showCart(Request $request)
{
    try {
        $token = $request->header('Authorization');
        $token = str_replace('Bearer ', '', $token);

        if (!JWTAuth::parseToken()->check()) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        $userId = JWTAuth::parseToken()->getPayload()->get('sub');

        $cart = Cart::with(['product.categories', 'product.styles'])
                    ->where('user_id', $userId)
                    ->get();

        if ($cart->isEmpty()) {
            return response()->json([], 200);
        }

        $cartData = $cart->filter(fn($item) => $item->product !== null)
            ->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'size' => $item->size,
                    'category_ids' => $item->product->categories->pluck('id')->toArray(),
                    'style_ids' => $item->product->styles->pluck('id')->toArray(),
                ];
            })->toArray();

        return response()->json($cartData, 200);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Ошибка при получении данных корзины: ' . $e->getMessage()], 500);
    }
}

public function showUserPurchases(Request $request)
{
    try {
        $token = $request->header('Authorization');
        $token = str_replace('Bearer ', '', $token);

        if (!JWTAuth::parseToken()->check()) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        $userId = JWTAuth::parseToken()->getPayload()->get('sub');

        $orders = Orders::with(['product.categories', 'product.styles'])
                    ->where('user_id', $userId)
                    ->get();

        if ($orders->isEmpty()) {
            return response()->json([], 200);
        }

        $ordersData = $orders->filter(fn($item) => $item->product !== null)
            ->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'size' => $item->size ?? null,
                    'category_ids' => $item->product->categories->pluck('id')->toArray(),
                    'style_ids' => $item->product->styles->pluck('id')->toArray(),
                ];
            })->toArray();

        return response()->json($ordersData, 200);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Ошибка при получении данных покупок: ' . $e->getMessage()], 500);
    }
}


}
