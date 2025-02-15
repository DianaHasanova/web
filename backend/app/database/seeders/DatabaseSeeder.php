<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
     /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            SellersSeeder::class,
            CategoriesSeeder::class,
            CustomersSeeder::class,
            ProductsSeeder::class,
           // ProductCategorySeeder::class,
           // ReviewsSeeder::class,
           // CartSeeder::class,
        ]);
    }
}
