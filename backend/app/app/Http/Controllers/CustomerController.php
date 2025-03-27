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
            'password' => Hash::make($request->password), // Хэширование пароля
        ]);

        // Генерация JWT-токена для нового пользователя
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
    /*
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|min:6',
    ]);

    $credentials = $request->only('email', 'password');

    try {
        $token = JWTAuth::parseToken()->attempt($credentials, ['provider' => 'user']);
        if (!$token) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
    } catch (JWTException $e) {
        return response()->json(['error' => 'Could not create token'], 500);
    }

    return response()->json(['token' => $token]); */
}


}
