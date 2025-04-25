import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpApiService } from '../core/services/http-api.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  constructor(
    private router: Router,
    private apiService: HttpApiService
  ) {
    this.checkAuthStatus();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.apiService.login({ email, password }).pipe(
      map(response => {
        if (response && response.token) {
          // Store the auth token and user details
          this.apiService.setAuthToken(response.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isLoggedIn = true;
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  register(email: string, password: string, firstName: string, lastName: string): Observable<boolean> {
    const userData = {
      name: `${firstName} ${lastName}`,
      email: email,
      password: password,
      password_confirmation: password, // Required by Laravel validation
      role: 'collaborateur' // Default role - you might want to make this configurable
    };

    return this.apiService.register(userData).pipe(
      map(response => {
        if (response && response.token) {
          // If auto-login after registration is desired, uncomment these lines:
          // this.apiService.setAuthToken(response.token);
          // localStorage.setItem('isLoggedIn', 'true');
          // localStorage.setItem('user', JSON.stringify(response.user));
          // this.isLoggedIn = true;
          return true;
        }
        return true; // Still return true if registration succeeded
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    // Call the API to invalidate the token on the server
    this.apiService.logout().subscribe({
      next: () => {
        this.completeLogout();
      },
      error: () => {
        // Even if the API call fails, we still want to log out locally
        this.completeLogout();
      }
    });
  }

  private completeLogout(): void {
    // Clear all auth data
    this.isLoggedIn = false;
    this.apiService.removeAuthToken();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): boolean {
    const token = this.apiService.getAuthToken();
    this.isLoggedIn = !!token && localStorage.getItem('isLoggedIn') === 'true';
    return this.isLoggedIn;
  }

  // Get the current authenticated user
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
}