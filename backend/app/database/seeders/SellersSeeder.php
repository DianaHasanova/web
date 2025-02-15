<?php

namespace Database\Seeders;

use App\Models\Seller;
use Faker\Factory;
use Illuminate\Database\Seeder;

class SellersSeeder extends Seeder
{
    public function run()
    {
        $faker = Factory::create('ru_RU');

        for ($i = 0; $i<5 ; $i++) {
            Seller::create([
                'name' => $faker->words(2, true),
                'contact_info' =>  $faker->email."\n".$faker->phoneNumber,
                'description' => $faker->realTextBetween(160,300),
            ]);
        }
    }
}
