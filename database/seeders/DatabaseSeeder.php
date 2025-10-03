<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create or Update Admin User
        User::updateOrCreate(
            ['email' => 'admin@sumc.co.zw'],
            [
                'name' => 'TaskForce Finance Admin',
                'password' => bcrypt('SUMC2030*'),
                'role' => 'admin',
                'email_verified_at' => time()
            ]
        );

        // Create or Update Regular User
        User::updateOrCreate(
            ['email' => 'finance@sumc.co.zw'],
            [
                'name' => 'TaskForce Finance User',
                'password' => bcrypt('SUMC2025*'),
                'role' => 'user',
                'email_verified_at' => time()
            ]
        );

        $this->call([
            ContributorTypeSeeder::class,
            MitupoSeeder::class
        ]);
    }
}
