import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sakai-admin';
  sidebarVisible = true;
  currentPage = 'Dashboard';
  
  constructor(
    private router: Router, 
    public themeService: ThemeService,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      if (url.includes('/employees')) {
        this.currentPage = 'Employee Management';
      } else if (url.includes('/dashboard') || url === '/') {
        this.currentPage = 'Dashboard';
      }
    });
  }
  
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  getPageTitle(): string {
    return this.currentPage;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }

  isAuthPage(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/register');
  }
}
