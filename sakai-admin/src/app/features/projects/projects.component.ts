import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';

// Import PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Import dialog components
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';
import { DeleteProjectDialogComponent } from './delete-project-dialog/delete-project-dialog.component';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ProgressBarModule,
    TagModule,
    AvatarModule,
    AvatarGroupModule,
    TooltipModule,
    ToastModule,
    EditProjectDialogComponent,
    DeleteProjectDialogComponent,
    AddProjectDialogComponent
  ],
  providers: [MessageService],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm: string = '';
  
  // Edit dialog properties
  editDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  addDialogVisible: boolean = false;
  selectedProject: Project | null = null;
  
  // Delete dialog reference
  @ViewChild(DeleteProjectDialogComponent) deleteDialog!: DeleteProjectDialogComponent;
  
  // For event listening
  private projectUpdatedListener: any;

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    
    // Listen for project updates
    this.projectUpdatedListener = () => {
      this.loadProjects();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Project updated successfully'
      });
    };
    
    window.addEventListener('project-updated', this.projectUpdatedListener);
  }
  
  ngOnDestroy(): void {
    // Clean up event listener
    window.removeEventListener('project-updated', this.projectUpdatedListener);
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.filteredProjects = [...this.projects];
    });
  }

  searchProjects(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProjects = [...this.projects];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProjects = this.projects.filter(project => 
      project.name.toLowerCase().includes(term) ||
      project.pm.name.toLowerCase().includes(term) ||
      project.tl.name.toLowerCase().includes(term) ||
      project.priority.toLowerCase().includes(term) ||
      project.status.toLowerCase().includes(term)
    );
  }

  getSeverity(priority: string): 'danger' | 'warn' | 'success' | 'info' {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warn';
      case 'Low':
        return 'success';
      default:
        return 'info';
    }
  }

  getStatusSeverity(status: string): 'danger' | 'warn' | 'success' | 'info' {
    switch (status) {
      case 'Delayed':
        return 'danger';
      case 'Ongoing':
        return 'success';
      case 'Not Started':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'info';
    }
  }

  getTeamTooltip(team: any[]): string {
    return team.map(member => member.name).join(', ');
  }

  getAdditionalTeamMembersText(team: any[]): string {
    return team.length > 5 ? `+${team.length - 4}` : '';
  }
  
  onRowClick(project: Project): void {
    this.selectedProject = {...project};
    this.editDialogVisible = true;
  }
  
  onViewProject(event: Event, project: Project): void {
    event.stopPropagation(); // Prevent row click
    this.router.navigate(['/projects', project.id]);
  }
  
  onDeleteProject(event: Event, project: Project): void {
    event.stopPropagation(); // Prevent row click
    
    this.deleteDialog.show(project, () => {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project deleted successfully'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error deleting project'
          });
          console.error('Error deleting project:', err);
        }
      });
    });
  }
  
  onAddProject(): void {
    this.addDialogVisible = true;
  }
}