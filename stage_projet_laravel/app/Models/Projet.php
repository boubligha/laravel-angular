<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Projet extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'statut',
        'equipe_id',
    ];

    // Relation : un projet appartient à une équipe
    public function equipe()
    {
        return $this->belongsTo(Equipe::class);
    }

    // Relation with employees
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_projet');
    }
}
