<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some users first with 'employee' role
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);
            
            // Create employee record for this user
            Employee::create([
                'user_id' => $user->id,
                'position' => ['Developer', 'Manager', 'Designer'][rand(0, 2)],
                'salary' => rand(30000, 80000),
                'status' => ['Active', 'On Leave', 'Remote'][rand(0, 2)],
                'phone' => '+1' . rand(1000000000, 9999999999),
                'work_hours_start' => '09:00',
                'work_hours_end' => '17:00',
                'break_time' => '12:00-13:00',
                'days_off' => json_encode(['Saturday', 'Sunday']),
                'leave_type' => ['Annual', 'Sick', 'Maternity', 'Paternity'][rand(0, 3)],
            ]);
        }
    }
}