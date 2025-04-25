import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateToRegister() {
    this.router.navigate(['register']);
  }

  onSubmit() {
    this.loginError = '';
    this.isLoading = true;

    if (!this.isValidEmail(this.email)) {
      this.loginError = 'Invalid email. Please enter a valid email address.';
      this.isLoading = false;
      return;
    } 
    
    if (this.password.length < 6) {
      this.loginError = 'Invalid password. Please enter at least 6 characters.';
      this.isLoading = false;
      return;
    }

    // Call the auth service to log in
    this.authService.login(this.email, this.password).subscribe({
      next: success => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = 'Login failed. Please check your credentials.';
        }
      },
      error: error => {
        this.isLoading = false;
        if (error.status === 401) {
          this.loginError = 'Invalid credentials. Please check your email and password.';
        } else {
          this.loginError = 'An error occurred. Please try again later.';
        }
        console.error('Login error:', error);
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}
