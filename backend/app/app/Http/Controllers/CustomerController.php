<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;


class CustomerController extends Controller
{
public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|unique:user|email',
            'password' => 'required|min:6',
        ]);

        $customer = Customer::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'image' => 'https://img.icons8.com/?size=100&id=85356&format=png&color=FFFFFF',
        ]);

        // Генерация JWT-токена
        $token = JWTAuth::fromUser($customer);

        return response()->json(['token' => $token, 'message' => 'Пользователь успешно зарегистрирован'], 201);
    }



public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|min:6',
    ]);

    $credentials = $request->only('email', 'password');

    try {
        $customer = Customer::where('email', $credentials['email'])->first(); // Найдите пользователя напрямую
        if (!$customer || !Hash::check($credentials['password'], $customer->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        $token = JWTAuth::fromUser($customer);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Could not create token'], 500);
    }
    return response()->json(['token' => $token]);
}

public function showProfile(Request $request)
{
$token = $request->header('Authorization');
            $token = str_replace('Bearer ', '', $token);

            if (!JWTAuth::parseToken()->check()) {
                return response()->json(['error' => 'Не авторизован'], 401);
            }

            $userId = JWTAuth::parseToken()->getPayload()->get('sub');
            $user = Customer::find($userId);

            if (!$user) {
                return response()->json(['error' => 'Пользователь не найден'], 404);
            }

            return response()->json([
                'name' => $user->name,
                'email' => $user->email,
                'image' => $user->image,
                // ... другие поля пользователя ...
            ]);
}

}
