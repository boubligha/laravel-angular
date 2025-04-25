<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'chemin_fichier',
        'date_upload',
        'taille',
        'type',
        'projet_id',
    ];

    // Un document appartient à un projet
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}
