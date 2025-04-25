import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  private apiUrl = environment.apiUrl; // Use the URL from environment

  constructor(private http: HttpClient) { }

  // Auth endpoints
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  // Method to get auth token from storage
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Method to set auth token in storage
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Method to remove auth token from storage
  removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }
}