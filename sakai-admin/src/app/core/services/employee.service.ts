import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import { HttpApiService } from './http-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private apiUrl = environment.apiUrl;
  
  // Keep mock data for fallback or development purposes
  private employees: Employee[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Software Engineer',
      email: 'sarah.j@example.com',
      phone: '+1-123-456-7890',
      status: 'online',
      workHours: {
        inTime: '9:00 AM',
        outTime: '5:00 PM',
        breakTime: '01:00',
        workHours: '07:00'
      }
    },
    {
      id: 2,
      name: 'Michael Anderson',
      position: 'Project Manager',
      email: 'michael.a@example.com',
      phone: '+1-234-567-8901',
      workHours: {
        inTime: '9:30 AM',
        outTime: '6:00 PM',
        breakTime: '01:30',
        workHours: '07:00'
      }
    },
    {
      id: 3,
      name: 'Priya Sharma',
      position: 'UX Designer',
      email: 'priya.s@example.com',
      phone: '+91-9876543210',
      status: 'absent',
      leaveType: 'Sick Leave'
    },
    {
      id: 4,
      name: 'David Brown',
      position: 'Data Analyst',
      email: 'david.b@example.com',
      phone: '+1-345-678-9012',
      workHours: {
        inTime: '10:00 AM',
        outTime: '6:30 PM',
        breakTime: '00:30',
        workHours: '07:00'
      }
    },
    {
      id: 5,
      name: 'Emily Davis',
      position: 'HR Executive',
      email: 'emily.d@example.com',
      phone: '+1-456-789-0123',
      workHours: {
        inTime: '9:15 AM',
        outTime: '5:45 PM',
        breakTime: '01:00',
        workHours: '07:30'
      }
    },
    {
      id: 6,
      name: 'John Miller',
      position: 'QA Engineer',
      email: 'john.m@example.com',
      phone: '+1-567-890-1234',
      status: 'half-day',
      workHours: {
        inTime: '8:45 AM',
        outTime: '01:00 PM',
        breakTime: '04:15',
        workHours: '04:15'
      }
    },
    {
      id: 7,
      name: 'Ananya Singh',
      position: 'Marketing Specialist',
      email: 'ananya.s@example.com',
      phone: '+91-9123487654'
    },
    {
      id: 8,
      name: 'Rajesh Kumar',
      position: 'Backend Developer',
      email: 'rajesh.k@example.com',
      phone: '+91-9123456789',
      workHours: {
        inTime: '9:00 AM',
        outTime: '5:00 PM',
        breakTime: '01:00',
        workHours: '07:00'
      }
    }
  ];

  constructor(
    private http: HttpClient,
    private apiService: HttpApiService
  ) { }

  // Get all employees from the API
  getEmployees(): Observable<Employee[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/employees`, { headers })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.employees) {
            // Make sure each employee has a proper imageUrl
            return response.employees.map(emp => {
              // If the image_url exists but imageUrl doesn't, map it
              if (emp.image_url && !emp.imageUrl) {
                emp.imageUrl = emp.image_url;
              }
              return emp;
            });
          }
          return this.employees; // Fallback to mock data
        }),
        catchError(error => {
          console.error('Error fetching employees:', error);
          return of(this.employees); // Fallback to mock data
        })
      );
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.getEmployees();
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<Employee> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/employees/${id}`, { headers })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.employee) {
            // Map image_url to imageUrl if it exists
            const employee = response.employee;
            if (employee.image_url && !employee.imageUrl) {
              employee.imageUrl = employee.image_url;
            }
            return employee;
          }
          const mockEmployee = this.employees.find(e => e.id === id);
          return mockEmployee || {} as Employee;
        }),
        catchError(error => {
          console.error(`Error fetching employee ${id}:`, error);
          const mockEmployee = this.employees.find(e => e.id === id);
          return of(mockEmployee || {} as Employee);
        })
      );
  }

  // Add a new employee
  addEmployee(employee: Employee): Observable<Employee> {
    const headers = this.getAuthHeaders();
    
    // If there's a Base64 image in the imageUrl, handle it separately
    if (employee.imageUrl && employee.imageUrl.startsWith('data:image')) {
      return this.addEmployeeWithImage(employee);
    }
    
    return this.http.post<any>(`${this.apiUrl}/employees`, employee, { headers })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.employee) {
            return response.employee;
          }
          // Fallback to mock behavior
          employee.id = this.employees.length + 1;
          this.employees.push(employee);
          return employee;
        }),
        catchError(error => {
          console.error('Error adding employee:', error);
          // Fallback to mock behavior
          employee.id = this.employees.length + 1;
          this.employees.push(employee);
          return of(employee);
        })
      );
  }

  // Update an existing employee
  updateEmployee(employee: Employee): Observable<Employee> {
    const headers = this.getAuthHeaders();
    
    // If there's a Base64 image in the imageUrl, handle it separately
    if (employee.imageUrl && employee.imageUrl.startsWith('data:image')) {
      return this.updateEmployeeWithImage(employee);
    }
    
    return this.http.put<any>(`${this.apiUrl}/employees/${employee.id}`, employee, { headers })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.employee) {
            return response.employee;
          }
          // Fallback to mock behavior
          const index = this.employees.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.employees[index] = employee;
          }
          return employee;
        }),
        catchError(error => {
          console.error('Error updating employee:', error);
          // Fallback to mock behavior
          const index = this.employees.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.employees[index] = employee;
          }
          return of(employee);
        })
      );
  }

  // Delete an employee
  deleteEmployee(id: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/employees/${id}`, { headers })
      .pipe(
        map(response => {
          if (response && response.status === 'success') {
            return true;
          }
          // Fallback to mock behavior
          const index = this.employees.findIndex(e => e.id === id);
          if (index !== -1) {
            this.employees.splice(index, 1);
          }
          return true;
        }),
        catchError(error => {
          console.error('Error deleting employee:', error);
          // Fallback to mock behavior
          const index = this.employees.findIndex(e => e.id === id);
          if (index !== -1) {
            this.employees.splice(index, 1);
          }
          return of(true);
        })
      );
  }

  // Upload employee image - updated with better error handling
  uploadEmployeeImage(employeeId: number, imageFile: File): Observable<string> {
    const headers = this.getAuthHeaders();
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return this.http.post<any>(`${this.apiUrl}/employees/${employeeId}/upload-image`, formData, { headers })
      .pipe(
        tap(response => console.log('Image upload response:', response)),
        map(response => {
          if (response && response.status === 'success' && response.image_url) {
            return response.image_url;
          }
          return '';
        }),
        catchError(error => {
          console.error('Error uploading image:', error);
          return of('');
        })
      );
  }

  // Helper method to add employee with image - completely rewritten
  private addEmployeeWithImage(employee: Employee): Observable<Employee> {
    // First create the employee without the image
    const employeeData = { ...employee };
    const imageUrl = employeeData.imageUrl;
    employeeData.imageUrl = ''; // Remove the base64 image
    
    const headers = this.getAuthHeaders();
    
    console.log('Creating employee without image first:', employeeData);
    
    return this.http.post<any>(`${this.apiUrl}/employees`, employeeData, { headers })
      .pipe(
        tap(response => console.log('Create employee response:', response)),
        switchMap(response => {
          if (response && response.status === 'success' && response.employee) {
            const newEmployee = response.employee;
            
            // Then upload the image if we have one
            if (imageUrl && imageUrl.startsWith('data:image')) {
              console.log('Uploading image for employee ID:', newEmployee.id);
              
              // Convert base64 to blob
              const imageBlob = this.dataURItoBlob(imageUrl);
              const imageFile = new File([imageBlob], 'profile.jpg', { type: 'image/jpeg' });
              
              // Upload the image and wait for it to complete
              return this.uploadEmployeeImage(newEmployee.id, imageFile).pipe(
                tap(uploadedUrl => console.log('Image uploaded, URL:', uploadedUrl)),
                switchMap(uploadedUrl => {
                  if (uploadedUrl) {
                    // After image upload, fetch the complete employee again to ensure we have updated data
                    return this.getEmployeeById(newEmployee.id);
                  }
                  return of(newEmployee);
                })
              );
            }
            
            return of(newEmployee);
          }
          
          // Fallback to mock behavior
          employee.id = this.employees.length + 1;
          this.employees.push(employee);
          return of(employee);
        }),
        catchError(error => {
          console.error('Error adding employee with image:', error);
          // Fallback to mock behavior
          employee.id = this.employees.length + 1;
          this.employees.push(employee);
          return of(employee);
        })
      );
  }

  // Helper method to update employee with image - completely rewritten
  private updateEmployeeWithImage(employee: Employee): Observable<Employee> {
    // First update the employee without the image
    const employeeData = { ...employee };
    const imageUrl = employeeData.imageUrl;
    employeeData.imageUrl = ''; // Remove the base64 image
    
    const headers = this.getAuthHeaders();
    
    console.log('Updating employee without image first:', employeeData);
    
    return this.http.put<any>(`${this.apiUrl}/employees/${employee.id}`, employeeData, { headers })
      .pipe(
        tap(response => console.log('Update employee response:', response)),
        switchMap(response => {
          if (response && response.status === 'success' && response.employee) {
            const updatedEmployee = response.employee;
            
            // Then upload the image if we have one
            if (imageUrl && imageUrl.startsWith('data:image')) {
              console.log('Uploading new image for employee ID:', updatedEmployee.id);
              
              // Convert base64 to blob
              const imageBlob = this.dataURItoBlob(imageUrl);
              const imageFile = new File([imageBlob], 'profile.jpg', { type: 'image/jpeg' });
              
              // Upload the image and wait for it to complete
              return this.uploadEmployeeImage(updatedEmployee.id, imageFile).pipe(
                tap(uploadedUrl => console.log('Image uploaded, URL:', uploadedUrl)),
                switchMap(uploadedUrl => {
                  if (uploadedUrl) {
                    // After image upload, fetch the complete employee again to ensure we have updated data
                    return this.getEmployeeById(updatedEmployee.id);
                  }
                  return of(updatedEmployee);
                })
              );
            }
            
            return of(updatedEmployee);
          }
          
          // Fallback to mock behavior
          const index = this.employees.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.employees[index] = employee;
          }
          return of(employee);
        }),
        catchError(error => {
          console.error('Error updating employee with image:', error);
          // Fallback to mock behavior
          const index = this.employees.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.employees[index] = employee;
          }
          return of(employee);
        })
      );
  }

  // Helper method to convert data URI to Blob
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.apiService.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}