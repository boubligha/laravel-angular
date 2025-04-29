<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasApiTokens;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function administrateur()
{
    return $this->hasOne(Administrateur::class);
}

public function stagiaire()
{
    return $this->hasOne(Stagiaire::class);
}

public function collaborateur()
{
    return $this->hasOne(Collaborateur::class);
}

    // Définir la relation avec les équipes
    public function equipes()
    {
        return $this->belongsToMany(Equipe::class, 'equipe_utilisateur');
    }

    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

}
