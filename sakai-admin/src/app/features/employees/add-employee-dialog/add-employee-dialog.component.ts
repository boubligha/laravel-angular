import { Component, Inject, ElementRef, ViewChild, OnInit } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HttpApiService } from '../../../core/services/http-api.service';

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
export class AddEmployeeDialogComponent implements OnInit {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDaysOff: string[] = [];
  users: any[] = [];
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: Employee },
    private http: HttpClient,
    private apiService: HttpApiService
  ) {
    this.employeeForm = this.fb.group({
      user_id: [null, [Validators.required]],
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      status: ['online'],
      imageUrl: [''],
      salary: [0, [Validators.required, Validators.min(0)]],
      daysOff: [[]],
      work_hours_start: ['9:00 AM', Validators.required],
      work_hours_end: ['5:00 PM', Validators.required],
      break_time: ['01:00', Validators.required]
    });
    
    if (data?.employee) {
      this.employeeForm.patchValue(data.employee);
      // Make sure daysOff exists on the employee object
      if (data.employee.daysOff !== undefined) {
        this.selectedDaysOff = data.employee.daysOff;
      }
    }
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    const token = this.apiService.getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    this.http.get<any>(`${environment.apiUrl}/users`, { headers })
      .subscribe(
        response => {
          if (response && Array.isArray(response)) {
            this.users = response;
          } else {
            console.error('Unexpected response format', response);
          }
        },
        error => {
          console.error('Error loading users', error);
        }
      );
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
      
      // Convert days off to JSON string if it's an array
      if (Array.isArray(this.selectedDaysOff)) {
        formData.days_off = this.selectedDaysOff;
      }
      
      // If we have a file selected, the imageUrl will be the Data URL
      if (this.previewImageUrl) {
        formData.imageUrl = this.previewImageUrl;
      }
      
      // Map selected user's email to formData.email if user_id is selected
      if (formData.user_id) {
        const selectedUser = this.users.find(user => user.id === formData.user_id);
        if (selectedUser) {
          formData.email = selectedUser.email;
          formData.name = selectedUser.name;
        }
      }
      
      this.dialogRef.close(formData);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
