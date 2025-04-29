import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { CommonModule } from '@angular/common';

// Import PrimeNG modules
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { InputTextarea } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

interface OptionItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    SliderModule,
    InputTextarea,
    MultiSelectModule,
    TabViewModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    CardModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ProjectDetailComponent implements OnInit {
  projectId: string = '';
  project!: Project;
  loading = true;
  projectForm!: FormGroup;
  activeTabIndex = 0;
  
  statusOptions: OptionItem[] = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  
  priorityOptions: OptionItem[] = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' }
  ];
  
  managerOptions: OptionItem[] = [];
  teamLeadOptions: OptionItem[] = [];
  teamMemberOptions: OptionItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadProjectData();
    this.loadTeamOptions();
  }

  initializeForm() {
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      startDate: [null],
      deadline: [null],
      progress: [0],
      status: ['Not Started'],
      priority: ['Medium'],
      pm: [null],
      tl: [null],
      team: [[]]
    });
  }

  loadProjectData() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe(
        (project: Project) => {
          this.project = project;
          this.populateForm(project);
          this.loading = false;
        },
        (error: any) => {
          console.error('Error loading project:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load project data'
          });
          this.loading = false;
        }
      );
    }
  }

  loadTeamOptions() {
    // In a real app, you would fetch these from a service
    // Here we're just simulating the data
    this.managerOptions = [
      { label: 'Sarah Johnson', value: { id: 1, name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' } },
      { label: 'Emily Davis', value: { id: 2, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' } },
      { label: 'David Miller', value: { id: 3, name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' } }
    ];
    
    this.teamLeadOptions = [
      { label: 'Michael Chen', value: { id: 1, name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' } },
      { label: 'Robert Wilson', value: { id: 2, name: 'Robert Wilson', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' } },
      { label: 'Daniel Lee', value: { id: 3, name: 'Daniel Lee', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' } }
    ];
    
    this.teamMemberOptions = [
      { label: 'Sarah Johnson', value: { id: 1, name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', role: 'Developer' } },
      { label: 'Michael Chen', value: { id: 2, name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', role: 'UX Designer' } },
      { label: 'Emily Davis', value: { id: 3, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', role: 'Business Analyst' } },
      { label: 'John Smith', value: { id: 4, name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', role: 'Developer' } },
      { label: 'Alice Wong', value: { id: 5, name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', role: 'QA Tester' } },
      { label: 'David Miller', value: { id: 6, name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', role: 'DevOps Engineer' } },
      { label: 'Lisa Brown', value: { id: 7, name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg', role: 'Developer' } },
      { label: 'Robert Wilson', value: { id: 8, name: 'Robert Wilson', avatar: 'https://randomuser.me/api/portraits/men/8.jpg', role: 'Data Scientist' } }
    ];
  }

  populateForm(project: Project) {
    // Convert string dates to Date objects if needed
    const startDate = project.startDate ? new Date(project.startDate) : null;
    const deadline = project.deadline ? new Date(project.deadline) : null;
    
    // Find the project manager from options
    const projectManager = project.pm ? 
      this.managerOptions.find(m => m.value.id === project.pm.id)?.value : null;
    
    // Find the team lead from options
    const teamLead = project.tl ? 
      this.teamLeadOptions.find(t => t.value.id === project.tl.id)?.value : null;
    
    // Map team members to the format expected by multiSelect
    const teamMembers = project.team ? 
      project.team.map(member => {
        const option = this.teamMemberOptions.find(t => t.value.id === member.id);
        return option;
      }).filter(Boolean) : [];
    
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      startDate: startDate || '',
      deadline: deadline,
      progress: project.progress || 0,
      status: project.status,
      priority: project.priority,
      pm: projectManager,
      tl: teamLead,
      team: teamMembers
    });
  }

  onSaveProject() {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please fill in all required fields' 
      });
      return;
    }
    
    const formValue = this.projectForm.value;
    
    // Convert date objects to strings
    const startDate = formValue.startDate ? 
      new Date(formValue.startDate).toISOString().split('T')[0] : null;
    
    const deadline = formValue.deadline ? 
      new Date(formValue.deadline).toISOString().split('T')[0] : null;
    
    const updatedProject: Project = {
      ...this.project,
      name: formValue.name,
      description: formValue.description,
      startDate: startDate,
      deadline: deadline,
      progress: formValue.progress,
      status: formValue.status,
      priority: formValue.priority,
      pm: formValue.pm,
      tl: formValue.tl,
      team: formValue.team ? formValue.team.map((member: any) => member.value) : []
    };
    
    this.projectService.updateProject(updatedProject).subscribe(
      () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Project updated successfully' 
        });
        // Reload project data to reflect changes
        this.loadProjectData();
      },
      (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to update project' 
        });
      }
    );
  }

  onDeleteProject() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.project && this.project.id) {
          // Pass the numeric ID to the deleteProject method
          this.projectService.deleteProject(Number(this.project.id)).subscribe(
            () => {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Project deleted successfully' 
              });
              this.router.navigate(['/projects']);
            },
            (error) => {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to delete project' 
              });
            }
          );
        }
      }
    });
  }

  navigateBack() {
    this.router.navigate(['/projects']);
  }

  // Helper method to get CSS class for priority badge
  getSeverity(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'info';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'warning';
      case 'Critical':
        return 'danger';
      default:
        return 'info';
    }
  }

  // Helper method to get CSS class for status badge
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Not Started':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'On Hold':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }

  // Helper method to mark all controls in form group as touched for validation
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}