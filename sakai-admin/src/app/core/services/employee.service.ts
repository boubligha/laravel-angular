import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private employees: Employee[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Software Engineer',
      email: 'sarah.j@example.com',
      phone: '+1-123-456-7890',
      status: 'online',
      workHours: {
        inTime: '9:00 AM',
        outTime: '5:00 PM',
        breakTime: '01:00',
        workHours: '07:00'
      }
    },
    {
      id: 2,
      name: 'Michael Anderson',
      position: 'Project Manager',
      email: 'michael.a@example.com',
      phone: '+1-234-567-8901',
      workHours: {
        inTime: '9:30 AM',
        outTime: '6:00 PM',
        breakTime: '01:30',
        workHours: '07:00'
      }
    },
    {
      id: 3,
      name: 'Priya Sharma',
      position: 'UX Designer',
      email: 'priya.s@example.com',
      phone: '+91-9876543210',
      status: 'absent',
      leaveType: 'Sick Leave'
    },
    {
      id: 4,
      name: 'David Brown',
      position: 'Data Analyst',
      email: 'david.b@example.com',
      phone: '+1-345-678-9012',
      workHours: {
        inTime: '10:00 AM',
        outTime: '6:30 PM',
        breakTime: '00:30',
        workHours: '07:00'
      }
    },
    {
      id: 5,
      name: 'Emily Davis',
      position: 'HR Executive',
      email: 'emily.d@example.com',
      phone: '+1-456-789-0123',
      workHours: {
        inTime: '9:15 AM',
        outTime: '5:45 PM',
        breakTime: '01:00',
        workHours: '07:30'
      }
    },
    {
      id: 6,
      name: 'John Miller',
      position: 'QA Engineer',
      email: 'john.m@example.com',
      phone: '+1-567-890-1234',
      status: 'half-day',
      workHours: {
        inTime: '8:45 AM',
        outTime: '01:00 PM',
        breakTime: '04:15',
        workHours: '04:15'
      }
    },
    {
      id: 7,
      name: 'Ananya Singh',
      position: 'Marketing Specialist',
      email: 'ananya.s@example.com',
      phone: '+91-9123487654'
    },
    {
      id: 8,
      name: 'Rajesh Kumar',
      position: 'Backend Developer',
      email: 'rajesh.k@example.com',
      phone: '+91-9123456789',
      workHours: {
        inTime: '9:00 AM',
        outTime: '5:00 PM',
        breakTime: '01:00',
        workHours: '07:00'
      }
    }
  ];

  constructor() { }

  getEmployees(): Observable<Employee[]> {
    return of(this.employees);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    employee.id = this.employees.length + 1;
    this.employees.push(employee);
    return of(employee);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const index = this.employees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
      this.employees[index] = employee;
    }
    return of(employee);
  }

  deleteEmployee(id: number): Observable<boolean> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}