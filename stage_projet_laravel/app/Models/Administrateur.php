<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Administrateur extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array', // pour que le champ JSON soit bien traité en tableau
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
