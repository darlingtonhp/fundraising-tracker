<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributorType extends Model
{
    use HasFactory;
    protected $guarded = ['id', 'created_at','updated_at'];
     public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }
}
