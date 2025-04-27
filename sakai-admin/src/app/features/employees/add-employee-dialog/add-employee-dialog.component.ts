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
  selector: 'app-add-employee-dialog',
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
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.scss']
})
export class AddEmployeeDialogComponent {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDaysOff: string[] = [];
  
  @ViewChild('fileInput') fileInput!: ElementRef; // Added non-null assertion operator
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: Employee }
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      status: ['online'],
      imageUrl: [''],
      salary: [0, [Validators.required, Validators.min(0)]],
      daysOff: [[]],
      workHours: this.fb.group({
        inTime: ['9:00 AM', Validators.required],
        outTime: ['5:00 PM', Validators.required],
        breakTime: ['01:00', Validators.required],
        workHours: ['07:00', Validators.required]
      })
    });
    
    if (data?.employee) {
      this.employeeForm.patchValue(data.employee);
      // Make sure daysOff exists on the employee object
      if (data.employee.daysOff !== undefined) {
        this.selectedDaysOff = data.employee.daysOff;
      }
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
      if (this.previewImageUrl) {
        formData.imageUrl = this.previewImageUrl;
      }
      
      this.dialogRef.close(formData);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
