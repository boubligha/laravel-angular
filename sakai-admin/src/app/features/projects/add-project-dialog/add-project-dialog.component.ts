import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../core/models/project.model';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-add-project-dialog',
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
    MatSliderModule,
    MatIconModule
  ],
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss']
})
export class AddProjectDialogComponent {
  projectForm: FormGroup;
  employees: Employee[] = [];
  priorities = ['Low', 'Medium', 'High'];
  statuses = ['Not Started', 'Ongoing', 'Completed', 'Delayed'];
  
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project?: Project }
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      deadline: [new Date(new Date().setMonth(new Date().getMonth() + 1)), [Validators.required]],
      budget: [0, [Validators.required, Validators.min(0)]],
      priority: ['Medium', [Validators.required]],
      status: ['Not Started', [Validators.required]],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      pmId: [null, [Validators.required]],
      tlId: [null, [Validators.required]],
      teamIds: [[], [Validators.required]]
    });
    
    // Load employees for dropdowns
    this.loadEmployees();
  }
  
  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }
  
  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValues = this.projectForm.value;
      
      // Find full employee objects based on IDs
      const pm = this.employees.find(e => e.id === formValues.pmId);
      const tl = this.employees.find(e => e.id === formValues.tlId);
      const team = this.employees.filter(e => formValues.teamIds.includes(e.id));
      
      // Create project object with employee references
      const project: Partial<Project> = {
        name: formValues.name,
        description: formValues.description,
        startDate: this.formatDate(formValues.startDate),
        deadline: this.formatDate(formValues.deadline),
        budget: formValues.budget,
        priority: formValues.priority,
        status: formValues.status,
        progress: formValues.progress,
        pm: {
          id: pm?.id || 0,
          name: pm?.name || '',
          avatar: pm?.imageUrl || ''
        },
        tl: {
          id: tl?.id || 0,
          name: tl?.name || '',
          avatar: tl?.imageUrl || ''
        },
        team: team.map(member => ({
          id: member.id,
          name: member.name,
          avatar: member.imageUrl || ''
        }))
      };
      
      this.dialogRef.close(project);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  // Format date to string (YYYY-MM-DD)
  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}