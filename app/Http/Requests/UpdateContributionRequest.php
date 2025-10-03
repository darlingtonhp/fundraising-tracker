<?php
// app/Http/Requests/UpdateContributionRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContributionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'contributor_name' => 'required|string|unique:contributions,contributor_name,' . $this->contribution->id,
            'mutupo_id' => 'required|exists:mitupos,id',
            'contributor_type_id' => 'required|exists:contributor_types,id',
            'no_of_tshirts' => 'required|integer|min:0',
            'no_of_cement_bags' => 'required|integer|min:0',
            'cement_amount' => 'required|numeric|min:0',
        ];
    }
}