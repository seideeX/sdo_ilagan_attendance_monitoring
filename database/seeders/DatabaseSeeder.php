<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Administrator\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\Convertion;
use Database\Seeders\MonthlySeeder;
use Database\Seeders\LeaveCardSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(Convertion::class);

        $employee = Employee::create([
            'first_name' => 'Reycarl',
            'middle_name' => 'Dela Cruz',
            'last_name' => 'Medico',
            'position' => 'Administrative Officer 5',
            'department' => 'ADMINISTRATIVE UNIT',
            'work_type' => 'Full',
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123'),
            'employee_id' => $employee->id,
        ]);

        Employee::factory(5)->create();

        $this->call([
            MonthlySeeder::class,
            LeaveCardSeeder::class,
        ]);
    }
}
