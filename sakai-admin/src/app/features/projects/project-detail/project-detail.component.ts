import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProjectDetailComponent implements OnInit {
  projectId: string;
  project: Project;
  loading = true;
  projectForm: FormGroup;
  activeTabIndex = 0;
  
  statusOptions = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  
  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' }
  ];
  
  managerOptions = [];
  teamLeadOptions = [];
  teamMemberOptions = [];

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
    this.loading = true;
    this.projectId = this.route.snapshot.paramMap.get('id');
    
    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe(
        (project) => {
          this.project = project;
          this.populateForm(project);
          this.loading = false;
        },
        (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load project data' 
          });
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
      this.router.navigate(['/projects']);
    }
  }

  loadTeamOptions() {
    // Simulating loading team options from a service
    // In a real app, you would load these from your employee service
    this.managerOptions = [
      { label: 'John Smith', value: { id: '1', name: 'John Smith', role: 'Project Manager', avatar: 'assets/images/avatar/avatar1.png' } },
      { label: 'Sarah Johnson', value: { id: '2', name: 'Sarah Johnson', role: 'Project Manager', avatar: 'assets/images/avatar/avatar2.png' } }
    ];
    
    this.teamLeadOptions = [
      { label: 'Michael Brown', value: { id: '3', name: 'Michael Brown', role: 'Team Lead', avatar: 'assets/images/avatar/avatar3.png' } },
      { label: 'Emily Davis', value: { id: '4', name: 'Emily Davis', role: 'Team Lead', avatar: 'assets/images/avatar/avatar4.png' } }
    ];
    
    this.teamMemberOptions = [
      { label: 'David Wilson', value: { id: '5', name: 'David Wilson', role: 'Developer', avatar: 'assets/images/avatar/avatar5.png' } },
      { label: 'Jessica Martinez', value: { id: '6', name: 'Jessica Martinez', role: 'Designer', avatar: 'assets/images/avatar/avatar6.png' } },
      { label: 'James Taylor', value: { id: '7', name: 'James Taylor', role: 'QA Engineer', avatar: 'assets/images/avatar/avatar7.png' } },
      { label: 'Lisa Anderson', value: { id: '8', name: 'Lisa Anderson', role: 'Backend Developer', avatar: 'assets/images/avatar/avatar8.png' } }
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
      startDate: startDate,
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
      team: formValue.team ? formValue.team.map(member => member.value) : []
    };
    
    this.projectService.updateProject(this.projectId, updatedProject).subscribe(
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
        this.projectService.deleteProject(this.projectId).subscribe(
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