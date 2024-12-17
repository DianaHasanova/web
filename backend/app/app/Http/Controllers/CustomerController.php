<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class CustomerController extends Controller
{
public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:user', // Проверка на уникальность логина
            'password' => 'required|min:6', // Проверка на длину и подтверждение пароля
        ]);

        Customer::create([
            'name' => $request->name,
            'password' => Hash::make($request->password), // Хэширование пароля
        ]);

        return response()->json(['message' => 'Пользователь успешно зарегистрирован'], 201);
    }
}
