<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'salary',
        'status',
        'image_url',
        'phone',
        'work_hours_start',
        'work_hours_end',
        'break_time',
        'days_off',
        'leave_type',
    ];

    protected $casts = [
        'days_off' => 'array',
        'salary' => 'decimal:2',
    ];

    // Relation with User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation with Projet model (if needed)
    public function projets()
    {
        return $this->belongsToMany(Projet::class, 'employee_projet');
    }
}