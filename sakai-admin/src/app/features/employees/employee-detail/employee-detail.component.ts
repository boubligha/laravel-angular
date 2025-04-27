import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { EditEmployeeDialogComponent } from '../edit-employee-dialog/edit-employee-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.loadEmployee(parseInt(employeeId, 10));
    } else {
      this.error = 'Employee ID not provided';
      this.isLoading = false;
    }
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee: Employee) => {
        this.employee = employee;
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.error = 'Error loading employee details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  editEmployee(): void {
    if (!this.employee) return;
    
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      width: '800px',
      data: { employee: this.employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.updateEmployee(result).subscribe({
          next: (updatedEmployee) => {
            this.employee = updatedEmployee;
          },
          error: (err) => {
            console.error('Error updating employee:', err);
          }
        });
      }
    });
  }

  deleteEmployee(): void {
    if (!this.employee) return;
    
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${this.employee.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(this.employee!.id).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (err) => {
            console.error('Error deleting employee:', err);
          }
        });
      }
    });
  }

  getStatusColor(status: string | undefined): string {
    if (!status) return '';
    
    switch (status) {
      case 'online': return 'green';
      case 'absent': return 'red';
      case 'on-leave': return 'orange';
      case 'half-day': return 'blue';
      default: return 'grey';
    }
  }

  getDaysOffLabel(daysOff: string[] | undefined): string {
    if (!daysOff || daysOff.length === 0) {
      return 'None';
    }
    return daysOff.join(', ');
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}