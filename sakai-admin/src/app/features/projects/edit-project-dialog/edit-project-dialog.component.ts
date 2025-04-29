import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { MessageService } from 'primeng/api';

// Import PrimeNG modules
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface OptionItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-edit-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    MultiSelectModule,
    SliderModule,
    InputTextarea,
    ButtonModule,
    ProgressBarModule,
    TagModule,
    ProgressSpinnerModule
  ],
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() project: Project | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() projectUpdated = new EventEmitter<Project>();
  
  projectForm!: FormGroup;
  loading: boolean = false;
  
  statusOptions: OptionItem[] = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Delayed', value: 'Delayed' },
    { label: 'Completed', value: 'Completed' }
  ];
  
  priorityOptions: OptionItem[] = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];
  
  managerOptions: OptionItem[] = [];
  teamLeadOptions: OptionItem[] = [];
  teamMemberOptions: OptionItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTeamOptions();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && changes['project'].currentValue && this.projectForm) {
      this.populateForm(changes['project'].currentValue);
    }
    
    if (changes['visible'] && changes['visible'].currentValue === true && this.project) {
      this.loading = true;
      
      // Simulate loading data (in a real app, you might need to fetch fresh data)
      setTimeout(() => {
        if (this.project) {
          this.populateForm(this.project);
        }
        this.loading = false;
      }, 800);
    }
  }

  initForm(): void {
    this.projectForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      startDate: [null],
      deadline: [null],
      budget: [null],
      status: ['Not Started'],
      priority: ['Medium'],
      progress: [0],
      pm: [null],
      tl: [null],
      team: [[]]
    });
  }

  loadTeamOptions(): void {
    // In a real application, these would be loaded from a service
    this.managerOptions = [
      { label: 'Sarah Johnson', value: { id: 1, name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' } },
      { label: 'David Miller', value: { id: 2, name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' } },
      { label: 'Emily Davis', value: { id: 3, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' } }
    ];
    
    this.teamLeadOptions = [
      { label: 'Michael Chen', value: { id: 4, name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' } },
      { label: 'Robert Wilson', value: { id: 5, name: 'Robert Wilson', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' } },
      { label: 'Daniel Lee', value: { id: 6, name: 'Daniel Lee', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' } }
    ];
    
    this.teamMemberOptions = [
      { label: 'John Smith', value: { id: 7, name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' } },
      { label: 'Alice Wong', value: { id: 8, name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' } },
      { label: 'Lisa Brown', value: { id: 9, name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' } },
      { label: 'George Taylor', value: { id: 10, name: 'George Taylor', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' } },
      { label: 'Olivia Martinez', value: { id: 11, name: 'Olivia Martinez', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' } }
    ];
  }

  populateForm(project: Project): void {
    if (!project) return;
    
    // Parse dates from string format DD-MM-YYYY to Date objects
    let startDate = null;
    let deadline = null;
    
    if (project.startDate && project.startDate !== '-') {
      const [day, month, year] = project.startDate.split('-').map(Number);
      startDate = new Date(year, month - 1, day);
    }
    
    if (project.deadline && project.deadline !== '-') {
      const [day, month, year] = project.deadline.split('-').map(Number);
      deadline = new Date(year, month - 1, day);
    }
    
    // Find the matching manager option
    const pmOption = project.pm ? 
      this.managerOptions.find(m => m.value.id === project.pm.id) || 
      { label: project.pm.name, value: project.pm } : null;
    
    // Find the matching team lead option
    const tlOption = project.tl ? 
      this.teamLeadOptions.find(t => t.value.id === project.tl.id) || 
      { label: project.tl.name, value: project.tl } : null;
    
    // Map team members to options
    const teamOptions = project.team ? 
      project.team.map(member => {
        const option = this.teamMemberOptions.find(t => t.value.id === member.id);
        return option || { label: member.name, value: member };
      }) : [];
    
    // Update form values
    this.projectForm.patchValue({
      id: project.id,
      name: project.name,
      description: project.description || '',
      startDate: startDate,
      deadline: deadline,
      budget: project.budget || null,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      pm: pmOption?.value || null,
      tl: tlOption?.value || null,
      team: teamOptions.map(option => option.value)
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSave(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    const formValue = this.projectForm.value;
    
    // Format dates
    const startDate = formValue.startDate ? 
      this.formatDate(new Date(formValue.startDate)) : '';
    
    const deadline = formValue.deadline ? 
      this.formatDate(new Date(formValue.deadline)) : '-';

    // Create updated project object
    const updatedProject: Project = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      startDate: startDate,
      deadline: deadline,
      budget: formValue.budget,
      priority: formValue.priority,
      status: formValue.status,
      progress: formValue.progress,
      pm: formValue.pm,
      tl: formValue.tl,
      team: formValue.team
    };

    // Update the project
    this.projectService.updateProject(updatedProject).subscribe({
      next: (project) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project updated successfully'
        });
        this.projectUpdated.emit(project);
        
        // Dispatch a custom event that the projects component can listen for
        window.dispatchEvent(new CustomEvent('project-updated'));
        
        this.onCancel();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update project'
        });
        console.error('Error updating project:', err);
      }
    });
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  // Helper method to format date as DD-MM-YYYY
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
