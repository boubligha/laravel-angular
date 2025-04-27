import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Attendance } from '../../core/models/attendance.model';
import { AttendanceService } from '../../core/services/attendance.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: Attendance[] = [];
  employees: Employee[] = [];
  filterForm: FormGroup;
  
  displayedColumns: string[] = ['date', 'employee', 'checkInTime', 'checkOutTime', 'status', 'duration', 'notes', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Attendance>;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [new Date(new Date().setDate(new Date().getDate() - 30))],
      endDate: [new Date()],
      employeeId: ['all'],
      status: ['all']
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadEmployees();
    
    // Subscribe to form value changes to apply filters
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadData(): void {
    this.attendanceService.getAllAttendance().subscribe(data => {
      this.attendanceRecords = data;
      this.applyFilters();
    });
  }
  
  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
    });
  }
  
  applyFilters(): void {
    const filters = this.filterForm.value;
    
    let filtered = this.attendanceRecords;
    
    // Filter by date range
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate).toISOString().split('T')[0];
      const endDate = new Date(filters.endDate).toISOString().split('T')[0];
      
      filtered = filtered.filter(record => {
        return record.date >= startDate && record.date <= endDate;
      });
    }
    
    // Filter by employee
    if (filters.employeeId && filters.employeeId !== 'all') {
      filtered = filtered.filter(record => record.employeeId === +filters.employeeId);
    }
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(record => record.status === filters.status);
    }
    
    // Refresh the table
    this.attendanceRecords = [...filtered];
    
    if (this.table) {
      this.table.renderRows();
    }
  }
  
  resetFilters(): void {
    this.filterForm.patchValue({
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
      employeeId: 'all',
      status: 'all'
    });
  }
  
  getEmployeeName(employeeId: number): string {
    const employee = this.employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'present': return 'status-present';
      case 'absent': return 'status-absent';
      case 'late': return 'status-late';
      case 'half-day': return 'status-half-day';
      case 'on-leave': return 'status-on-leave';
      default: return '';
    }
  }

  editRecord(record: Attendance): void {
    // Implement edit functionality
    console.log('Edit record:', record);
  }

  deleteRecord(recordId: number): void {
    // Implement delete functionality
    this.attendanceService.deleteAttendance(recordId).subscribe(() => {
      this.loadData();
    });
  }
}