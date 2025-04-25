<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Equipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
    ];

    // Définir la relation avec les utilisateurs
    public function users()
    {
        return $this->belongsToMany(User::class, 'equipe_utilisateur');
    }
}


