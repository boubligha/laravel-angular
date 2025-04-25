import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  gender: string = '';
  password: string = '';
  confirmPassword: string = '';
  isConfirmed: boolean = false;
  registerError: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    this.registerError = '';
    this.isLoading = true;
    
    if (this.validateForm()) {
      this.authService.register(this.email, this.password, this.firstName, this.lastName)
        .subscribe({
          next: success => {
            this.isLoading = false;
            if (success) {
              alert('Registration successful! You can now login.');
              this.router.navigate(['/login']);
            } else {
              this.registerError = 'Registration failed. Please try again.';
            }
          },
          error: error => {
            this.isLoading = false;
            console.error('Registration error:', error);
            
            if (error.error && error.error.errors) {
              // Format Laravel validation errors
              const errors = error.error.errors;
              const errorMessages = [];
              
              for (const field in errors) {
                errorMessages.push(...errors[field]);
              }
              
              this.registerError = errorMessages.join('. ');
            } else if (error.error && error.error.message) {
              this.registerError = error.error.message;
            } else {
              this.registerError = 'Registration failed. Please try again.';
            }
          }
        });
    } else {
      this.isLoading = false;
      this.registerError = 'Please fix the form errors before submitting.';
    }
  }

  validateForm(): boolean {
    if (!this.firstName || !this.lastName) {
      return false;
    }
    if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
      return false;
    }
    if (!this.gender) {
      return false;
    }
    if (this.password.length < 6) {
      return false;
    }
    if (this.password !== this.confirmPassword) {
      return false;
    }
    if (!this.isConfirmed) {
      return false;
    }
    return true;
  }
}

