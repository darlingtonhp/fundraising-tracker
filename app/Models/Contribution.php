<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($contribution) {
            // Calculate tshirt amount based on discounted price
            $tshirtPrice = $contribution->use_discounted_tshirt ? 5 : 7;
            $contribution->tshirt_amount = $contribution->no_of_tshirts * $tshirtPrice;

            // Calculate total
            $contribution->total_contributed = $contribution->tshirt_amount + $contribution->cement_amount;
        });

        static::updating(function ($contribution) {
            // Recalculate tshirt amount based on discounted price
            $tshirtPrice = $contribution->use_discounted_tshirt ? 5 : 7;
            $contribution->tshirt_amount = $contribution->no_of_tshirts * $tshirtPrice;

            // Recalculate total
            $contribution->total_contributed = $contribution->tshirt_amount + $contribution->cement_amount;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mutupo()
    {
        return $this->belongsTo(Mitupo::class, 'mutupo_id');
    }

    public function contributorType()
    {
        return $this->belongsTo(ContributorType::class);
    }
}
