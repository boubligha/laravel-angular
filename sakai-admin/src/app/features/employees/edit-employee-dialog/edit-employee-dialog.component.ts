import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.scss']
})
export class EditEmployeeDialogComponent {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDaysOff: string[] = [];
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee }
  ) {
    // Initialize selectedDaysOff if it exists
    if (data.employee.daysOff) {
      this.selectedDaysOff = [...data.employee.daysOff];
    }
    
    // Set preview image if exists
    if (data.employee.imageUrl) {
      this.previewImageUrl = data.employee.imageUrl;
    }
    
    // Create the form with existing data
    this.employeeForm = this.fb.group({
      id: [data.employee.id],
      name: [data.employee.name, [Validators.required]],
      position: [data.employee.position, [Validators.required]],
      email: [data.employee.email, [Validators.required, Validators.email]],
      phone: [data.employee.phone, [Validators.required]],
      status: [data.employee.status || 'online'],
      imageUrl: [data.employee.imageUrl || ''],
      salary: [data.employee.salary || 0, [Validators.required, Validators.min(0)]],
      daysOff: [this.selectedDaysOff],
      workHours: this.fb.group({
        inTime: [data.employee.workHours?.inTime || '9:00 AM', Validators.required],
        outTime: [data.employee.workHours?.outTime || '5:00 PM', Validators.required],
        breakTime: [data.employee.workHours?.breakTime || '01:00', Validators.required],
        workHours: [data.employee.workHours?.workHours || '07:00', Validators.required]
      })
    });
    
    // Preserve leaveType if it exists
    if (data.employee.leaveType) {
      this.employeeForm.addControl('leaveType', this.fb.control(data.employee.leaveType));
    }
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }
  
  previewImage(): void {
    if (!this.selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImageUrl = reader.result;
      this.employeeForm.patchValue({ imageUrl: reader.result });
    };
    reader.readAsDataURL(this.selectedFile);
  }
  
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  
  toggleDayOff(day: string): void {
    const index = this.selectedDaysOff.indexOf(day);
    if (index >= 0) {
      this.selectedDaysOff.splice(index, 1);
    } else {
      this.selectedDaysOff.push(day);
    }
    this.employeeForm.patchValue({ daysOff: this.selectedDaysOff });
  }
  
  isDaySelected(day: string): boolean {
    return this.selectedDaysOff.includes(day);
  }
  
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      formData.daysOff = this.selectedDaysOff;
      
      // If we have a file selected, the imageUrl will be the Data URL
      if (this.selectedFile) {
        formData.imageUrl = this.previewImageUrl;
      }
      
      this.dialogRef.close(formData);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
