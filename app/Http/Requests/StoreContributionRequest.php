<?php
// app/Http/Requests/StoreContributionRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreContributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contributor_name' => 'required|string|unique:contributions',
            'mutupo_id' => 'required|exists:mitupos,id',
            'contributor_type_id' => 'required|exists:contributor_types,id',
            'no_of_tshirts' => 'required|integer|min:0',
            'no_of_cement_bags' => 'required|integer|min:0',
            'cement_amount' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id',
            'use_discounted_tshirt' => 'boolean',
             'tshirt_amount' => 'numeric|min:0',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'user_id' => Auth::id(),
        ]);
    }
}
