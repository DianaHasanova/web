<?php

namespace Database\Seeders;

use App\Models\Product;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsSeeder extends Seeder
{
    public function run()
    {
        $faker = Factory::create('ru_RU');
        $sellerIds = DB::table('sellers')->pluck('id')->toArray();

        if (empty($sellerIds)) {
            $this->command->error('No sellers found. Please seed sellers table first');
            return;
        }

        for ($i = 0; $i<5 ; $i++) {
            Product::create([
                'name' => $faker->sentence,
                'image' => "https://basket-10.wbbasket.ru/vol1442/part144299/144299547/images/big/1.webp",
                'price' => number_format((float)($faker->randomNumber(4) . '.' . $faker->randomNumber(2)), 2, '.', ''),
                'seller_id' => $faker->randomElement($sellerIds),
                'rating' => $faker->randomFloat(1, 0, 5),
            ]);
        }
    }
}
