import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  private projects: Project[] = [
    {
      id: 1,
      name: 'Cloud Infrastructure Setup',
      startDate: '10-10-2024',
      deadline: '10-12-2024',
      priority: 'High',
      pm: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      tl: {
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      team: [
        { name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
        { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' }
      ],
      status: 'Delayed',
      progress: 70
    },
    {
      id: 2,
      name: 'Data Migration Project',
      startDate: '01-11-2024',
      deadline: '-',
      priority: 'Medium',
      pm: {
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
      },
      tl: {
        name: 'Robert Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
      },
      team: [
        { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' }
      ],
      status: 'Not Started',
      progress: 0
    },
    {
      id: 3,
      name: 'E-commerce Portal Setup',
      startDate: '20-10-2024',
      deadline: '20-11-2024',
      priority: 'Low',
      pm: {
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
      },
      tl: {
        name: 'Daniel Lee',
        avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
      },
      team: [
        { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' }
      ],
      status: 'Ongoing',
      progress: 50
    },
    {
      id: 4,
      name: 'HRMS Implementation',
      startDate: '01-09-2024',
      deadline: '30-11-2024',
      priority: 'High',
      pm: {
        name: 'David Miller',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
      },
      tl: {
        name: 'Daniel Lee',
        avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
      },
      team: [
        { name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
        { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { name: 'George Taylor', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' }
      ],
      status: 'Delayed',
      progress: 85
    },
    {
      id: 5,
      name: 'Mobile App Development',
      startDate: '15-10-2024',
      deadline: '15-12-2024',
      priority: 'Medium',
      pm: {
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
      },
      tl: {
        name: 'Robert Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
      },
      team: [
        { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { name: 'George Taylor', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
        { name: 'Olivia Martinez', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' }
      ],
      status: 'Ongoing',
      progress: 40
    },
    {
      id: 6,
      name: 'Website Redesign',
      startDate: '01-11-2024',
      deadline: '30-11-2024',
      priority: 'High',
      pm: {
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
      },
      tl: {
        name: 'Robert Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
      },
      team: [
        { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { name: 'Alice Wong', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { name: 'Lisa Brown', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { name: 'George Taylor', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
        { name: 'Olivia Martinez', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
        { name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
        { name: 'Sophia Garcia', avatar: 'https://randomuser.me/api/portraits/women/13.jpg' }
      ],
      status: 'Ongoing',
      progress: 65
    }
  ];

  constructor() { }

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  addProject(project: Project): Observable<Project> {
    project.id = this.projects.length + 1;
    this.projects.push(project);
    return of(project);
  }

  updateProject(project: Project): Observable<Project> {
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this.projects[index] = project;
    }
    return of(project);
  }

  deleteProject(id: number): Observable<boolean> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}