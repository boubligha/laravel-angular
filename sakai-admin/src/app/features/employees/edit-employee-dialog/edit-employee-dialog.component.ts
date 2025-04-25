import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-edit-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.scss']
})
export class EditEmployeeDialogComponent {
  employeeForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee }
  ) {
    this.employeeForm = this.fb.group({
      id: [data.employee.id],
      name: [data.employee.name, [Validators.required]],
      position: [data.employee.position, [Validators.required]],
      email: [data.employee.email, [Validators.required, Validators.email]],
      phone: [data.employee.phone, [Validators.required]],
      status: [data.employee.status || 'online'],
      imageUrl: [data.employee.imageUrl || '']
    });
    
    // Preserve workHours and leaveType if they exist
    if (data.employee.workHours) {
      this.employeeForm.addControl('workHours', this.fb.control(data.employee.workHours));
    }
    
    if (data.employee.leaveType) {
      this.employeeForm.addControl('leaveType', this.fb.control(data.employee.leaveType));
    }
  }
  
  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.dialogRef.close(this.employeeForm.value);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
