<?php
// database/seeders/MitupoSeeder.php

namespace Database\Seeders;

use App\Models\Mitupo;
use Illuminate\Database\Seeder;

class MitupoSeeder extends Seeder
{
    public function run()
    {
        $mitupos = [
            ['name' => 'Shava', 'description' => 'Eland Totem'],
            ['name' => 'Nzou', 'description' => 'Big Beautiful Elephant Totem'],
            ['name' => 'Moyo', 'description' => 'Heart Totem'],
            ['name' => 'Shumba', 'description' => 'Lion Totem'],
            ['name' => 'Soko', 'description' => 'Monkey Totem'],
            ['name' => 'Gumbo', 'description' => 'Leg Totem'],
            ['name' => 'Ngwena/Garwe', 'description' => 'Crocodile Totem'],
            ['name' => 'Bonga/Chihwa', 'description' => 'Wild Cat Totem'],
            ['name' => 'Nhewa/Simboti', 'description' => 'Simboti Totem'],
            ['name' => 'Mheta', 'description' => 'Mheta Totem'],
            ['name' => 'Maposa/Nungu', 'description' => 'Maposa Totem'],
            ['name' => 'Dziva', 'description' => 'Maposa Totem'],
            ['name' => 'Humba', 'description' => 'Humba Totem'],
            ['name' => 'Beta', 'description' => 'Beta Totem'],
            ['name' => 'Hwesa', 'description' => 'Hwesa Totem'],
            ['name' => 'Mhara', 'description' => 'Mhara Totem'],
            ['name' => 'Mbizi', 'description' => 'Mbizi Totem'],
            ['name' => 'Hungwe', 'description' => 'Hungwe Totem'],
            ['name' => 'Gushungo', 'description' => 'Gushungo Totem'],
            ['name' => 'Gwai', 'description' => 'Sheep Totem'],
            ['name' => 'Chiropa', 'description' => 'Liver Totem'],
            ['name' => 'Mwendamberi', 'description' => 'Mwendamberi Totem'],
            ['name' => 'Nyati', 'description' => 'Nyati Totem'],
            ['name' => 'Nyere', 'description' => 'Nyere Totem'],
            ['name' => 'Jeso', 'description' => 'Jeso Totem'],
        ];

        foreach ($mitupos as $mitupo) {
            Mitupo::updateOrCreate(
                ['name' => $mitupo['name']],
                $mitupo
            );
        }
    }
}
