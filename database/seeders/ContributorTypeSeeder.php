<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ContributorType;

class ContributorTypeSeeder extends Seeder
{
    public function run()
    {
        $types = [
            ['name' => 'External Guest'],
            ['name' => 'Internal Guest'],
            ['name' => 'Fundraising Task Force Member'],
        ];

        foreach ($types as $type) {
            ContributorType::updateOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}
