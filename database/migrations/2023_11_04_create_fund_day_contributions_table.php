<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('fund_day_contributions', function (Blueprint $table) {
            $table->id();
            $table->string('contributor_name');
            $table->integer('cement_bags')->default(0);
            $table->decimal('cement_amount', 10, 2)->default(0);
            $table->decimal('total_contributed', 10, 2);
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fund_day_contributions');
    }
};