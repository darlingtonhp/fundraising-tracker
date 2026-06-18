<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contribution;
use App\Models\FundDayContribution;
use App\Models\Project;
use App\Models\User;
use App\Models\Mitupo;
use App\Models\ContributorType;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $mitupos = Mitupo::all();
        $types = ContributorType::all();

        if ($users->isEmpty() || $mitupos->isEmpty() || $types->isEmpty()) {
            return;
        }

        // 1. Contributions Dummy Data
        $contributors = [
            'Tinashe Moyo', 'Chipo Shumba', 'Farai Shava', 'Rumbidzai Mhofu', 
            'Tatenda Nzou', 'Nyasha Gumbo', 'Tendai Ngwena', 'Kudzai Soko',
            'Sibusiso Sibanda', 'Nomsa Dube', 'Tapiwa Maposa', 'Rudo Chiropa',
            'Sekai Beta', 'Vusumuzi Ndlovu', 'Simbarashe Humba', 'Albert Gushungo',
            'Tariro Mbizi', 'Gift Hungwe', 'Blessing Nyati', 'Clara Dziva',
            'Johnathan Smith', 'Sarah Jenkins', 'David Mwanga', 'Grace Chisale'
        ];

        $baseDate = Carbon::now()->subMonths(5); // Start 5 months ago

        foreach ($contributors as $index => $name) {
            $user = $users->random();
            $mitupo = $mitupos->random();
            $type = $types->random();

            $noOfTshirts = rand(0, 4);
            $useDiscounted = rand(0, 1) === 1;
            $cementBags = rand(0, 30);
            
            // Cement price is usually around $10-12 per bag
            $cementAmount = $cementBags * rand(10, 12);

            // Spread dates over the last 5 months
            $date = (clone $baseDate)->addDays(rand(1, 150));

            Contribution::create([
                'contributor_name' => $name,
                'mutupo_id' => $mitupo->id,
                'contributor_type_id' => $type->id,
                'user_id' => $user->id,
                'no_of_tshirts' => $noOfTshirts,
                'use_discounted_tshirt' => $useDiscounted,
                'no_of_cement_bags' => $cementBags,
                'cement_amount' => $cementAmount,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // 2. Fund Day Contributions Dummy Data
        $fundDayContributors = [
            'Elder Mutasa', 'Pastor Zhou', 'Mainini Rose', 'Baba George',
            'Mai Praise', 'Brother Amos', 'Sister Helen', 'Youth Group Contribution',
            'Mothers Union', 'Womens Fellowship', 'Mens Fellowship', 'Sunday School'
        ];

        foreach ($fundDayContributors as $name) {
            $user = $users->random();
            $cementBags = rand(5, 50);
            $cementAmount = $cementBags * rand(10, 12);
            $cashAmount = rand(50, 500);
            $totalContributed = $cementAmount + $cashAmount;

            $date = (clone $baseDate)->addDays(rand(1, 150));

            FundDayContribution::create([
                'contributor_name' => $name,
                'cement_bags' => $cementBags,
                'cement_amount' => $cementAmount,
                'total_contributed' => $totalContributed,
                'user_id' => $user->id,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // 3. Projects Dummy Data
        $projects = [
            [
                'name' => 'T-Shirt Fundraising Drive',
                'description' => 'Buying branded church T-shirts in bulk and selling them for building fundraising.',
                'project_cost' => 1200.00,
                'revenue' => 2500.00,
            ],
            [
                'name' => 'Church Choir Concert',
                'description' => 'A fundraising musical concert featuring local choirs. Ticket sales and donations.',
                'project_cost' => 500.00,
                'revenue' => 1800.00,
            ],
            [
                'name' => 'Fundraising Car Wash',
                'description' => 'Saturday youth car wash project held at the local shopping center.',
                'project_cost' => 150.00,
                'revenue' => 850.00,
            ],
            [
                'name' => 'Community Braai & Picnic',
                'description' => 'Family fun day food sales and game tickets fundraising activity.',
                'project_cost' => 800.00,
                'revenue' => 2200.00,
            ],
            [
                'name' => 'Building Block Pledges',
                'description' => 'Special appeal for members to purchase individual building blocks/bricks.',
                'project_cost' => 300.00,
                'revenue' => 3100.00,
            ],
        ];

        foreach ($projects as $proj) {
            $user = $users->random();
            $profit = $proj['revenue'] - $proj['project_cost'];
            $date = (clone $baseDate)->addDays(rand(1, 150));

            Project::create([
                'name' => $proj['name'],
                'description' => $proj['description'],
                'project_cost' => $proj['project_cost'],
                'revenue' => $proj['revenue'],
                'profit' => $profit,
                'user_id' => $user->id,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }
}
