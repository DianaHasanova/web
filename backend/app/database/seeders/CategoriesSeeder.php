<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Faker\Factory;

class CategoriesSeeder extends Seeder
{
    public function run()
    {
        $faker = Factory::create('ru_RU');
        $names = collect(['Одежда', 'Техника', 'Еда']);
        $length = count($names);

        for ($i = 0; $i < $length; $i++)
        Category::create([
            'name' => $names[$i],
            'slug' => $i,
            'parent_id'=> null,
            'description' => 'Отличная '.$names[$i],
            'image' =>  'https://imgplaceholder.com/' . $faker->randomNumber(5) . '/' . $faker->word . '.png',

        ]);

    }
}
