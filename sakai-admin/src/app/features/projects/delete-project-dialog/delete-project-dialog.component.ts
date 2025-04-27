import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-delete-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './delete-project-dialog.component.html',
  styleUrls: ['./delete-project-dialog.component.scss']
})
export class DeleteProjectDialogComponent {
  @Input() visible: boolean = false;
  project: Project | null = null;
  confirmCallback: Function | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  show(project: Project, confirmCallback: Function): void {
    this.project = project;
    this.confirmCallback = confirmCallback;
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }
  
  onConfirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.onCancel();
  }
  
  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.project = null;
    this.confirmCallback = null;
  }
}