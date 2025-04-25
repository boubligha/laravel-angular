<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Tache extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'date_creation',
        'date_echeance',
        'priorite',
        'statut',
        'projet_id',
        'user_id',
    ];

    // Une tâche appartient à un projet
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    // Une tâche est assignée à un utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
