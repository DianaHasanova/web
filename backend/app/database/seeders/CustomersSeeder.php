<?php

namespace Database\Seeders;

use App\Models\Customer;
use Faker\Factory;
use Illuminate\Database\Seeder;

class CustomersSeeder extends Seeder
{
    public function run()
    {
        $faker = Factory::create('ru_RU');

        for ($i = 0; $i<5 ; $i++) {
            Customer::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => $faker->password,
            ]);
        }
    }
}
