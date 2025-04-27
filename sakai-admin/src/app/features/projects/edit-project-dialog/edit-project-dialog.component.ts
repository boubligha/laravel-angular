import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() project: Project | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  projectForm!: FormGroup;
  
  priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];
  
  statusOptions = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Delayed', value: 'Delayed' },
    { label: 'Completed', value: 'Completed' }
  ];
  
  teamMembers = [
    { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
    { name: 'Robert Wilson', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
    { name: 'Daniel Lee', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { name: 'George Taylor', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { name: 'Olivia Martinez', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
    { name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'Sophia Garcia', avatar: 'https://randomuser.me/api/portraits/women/13.jpg' }
  ];
  
  managerOptions: any[] = [];
  teamLeadOptions: any[] = [];
  
  constructor(
    private fb: FormBuilder, 
    private projectService: ProjectService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.managerOptions = this.teamMembers.map(member => ({
      label: member.name,
      value: { name: member.name, avatar: member.avatar }
    }));
    
    this.teamLeadOptions = this.teamMembers.map(member => ({
      label: member.name,
      value: { name: member.name, avatar: member.avatar }
    }));
  }
  
  initForm(): void {
    this.projectForm = this.fb.group({
      id: [this.project?.id],
      name: [this.project?.name, Validators.required],
      startDate: [this.project?.startDate ? new Date(this.formatDateForInput(this.project.startDate)) : null, Validators.required],
      deadline: [this.project?.deadline && this.project.deadline !== '-' ? new Date(this.formatDateForInput(this.project.deadline)) : null],
      priority: [this.project?.priority, Validators.required],
      pm: [this.project?.pm, Validators.required],
      tl: [this.project?.tl, Validators.required],
      team: [this.project?.team, Validators.required],
      status: [this.project?.status, Validators.required],
      progress: [this.project?.progress, Validators.required]
    });
  }
  
  formatDateForInput(dateString: string): string {
    // Convert DD-MM-YYYY to YYYY-MM-DD for Date object
    if (dateString === '-') return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  }
  
  formatDateForOutput(date: Date | null): string {
    if (!date) return '-';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  }
  
  onDialogHide(): void {
    // Reset form when dialog is closed
    this.projectForm.reset();
  }
  
  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    
    const formData = this.projectForm.value;
    
    // Format dates
    const projectToSave: Project = {
      ...formData,
      startDate: this.formatDateForOutput(formData.startDate),
      deadline: formData.deadline ? this.formatDateForOutput(formData.deadline) : '-'
    };
    
    this.projectService.updateProject(projectToSave).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project updated successfully'
        });
        this.visible = false;
        this.visibleChange.emit(this.visible);
        // Emit event to refresh the project list
        window.dispatchEvent(new CustomEvent('project-updated'));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating project'
        });
        console.error('Error updating project:', err);
      }
    });
  }
  
  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}