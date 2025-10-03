<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contributions', function (Blueprint $table) {
            $table->id();
            $table->string('contributor_name')->unique();
            $table->foreignId('mutupo_id')->constrained('mitupos');
            $table->foreignId('contributor_type_id')->constrained();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Added user_id
            $table->integer('no_of_tshirts')->default(0);
            $table->decimal('tshirt_amount', 10, 2)->default(0);
            $table->integer('no_of_cement_bags')->default(0);
            $table->decimal('cement_amount', 10, 2)->default(0);
            $table->decimal('total_contributed', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contributions');
    }
};
