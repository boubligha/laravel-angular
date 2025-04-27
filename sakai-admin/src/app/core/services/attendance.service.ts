import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Attendance } from '../models/attendance.model';
import { HttpApiService } from './http-api.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private mockAttendance: Attendance[] = [];
  private nextId = 1;

  constructor(
    private http: HttpClient,
    private httpApiService: HttpApiService
  ) {
    // Initialize with some mock data
    this.generateMockData();
  }

  // Generate some mock attendance data for testing
  private generateMockData(): void {
    const today = new Date();
    const statuses: ('present' | 'absent' | 'late' | 'half-day' | 'on-leave')[] = 
      ['present', 'absent', 'late', 'half-day', 'on-leave'];
    
    // Generate attendance for the last 30 days for employees with IDs 1-5
    for (let employeeId = 1; employeeId <= 5; employeeId++) {
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate random check-in time between 8:00 AM and 9:30 AM
        const checkInHour = 8 + Math.floor(Math.random() * 2);
        const checkInMinute = Math.floor(Math.random() * 60);
        const checkInTime = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')} AM`;
        
        // Generate random check-out time between 4:30 PM and 6:00 PM
        const checkOutHour = 4 + Math.floor(Math.random() * 2);
        const checkOutMinute = Math.floor(Math.random() * 60);
        const checkOutTime = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')} PM`;
        
        // Calculate rough duration (this is simplified)
        const duration = `${8 - (9 - checkInHour) - (checkOutHour - 5)}:${Math.abs(checkInMinute - checkOutMinute).toString().padStart(2, '0')}`;
        
        this.mockAttendance.push({
          id: this.nextId++,
          employeeId,
          date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          checkInTime: randomStatus !== 'absent' ? checkInTime : undefined,
          checkOutTime: randomStatus !== 'absent' && randomStatus !== 'on-leave' ? checkOutTime : undefined,
          status: randomStatus,
          duration: randomStatus === 'present' ? duration : undefined,
          notes: this.getRandomNote(randomStatus)
        });
      }
    }
  }
  
  private getRandomNote(status: string): string {
    const notes: Record<string, string[]> = {
      'absent': ['Sick leave', 'Personal emergency', 'Family emergency'],
      'late': ['Traffic jam', 'Overslept', 'Public transport delay'],
      'on-leave': ['Annual leave', 'Medical leave', 'Family event'],
      'half-day': ['Doctor appointment', 'Personal errand', 'Child school event']
    };
    
    if (notes[status]) {
      return notes[status][Math.floor(Math.random() * notes[status].length)];
    }
    return '';
  }

  // Get all attendance records
  getAllAttendance(): Observable<Attendance[]> {
    // In a real app, you would use this.http.get<Attendance[]>(`${this.httpApiService.apiUrl}/attendance`);
    return of(this.mockAttendance);
  }

  // Get attendance by employee ID
  getAttendanceByEmployeeId(employeeId: number): Observable<Attendance[]> {
    // In a real app, you would use this.http.get<Attendance[]>(`${this.httpApiService.apiUrl}/attendance/employee/${employeeId}`);
    return of(this.mockAttendance.filter(a => a.employeeId === employeeId));
  }

  // Get attendance by date range
  getAttendanceByDateRange(startDate: string, endDate: string): Observable<Attendance[]> {
    // In a real app, you would implement a proper date range filter with API
    return of(this.mockAttendance.filter(a => {
      return a.date >= startDate && a.date <= endDate;
    }));
  }

  // Add new attendance record
  addAttendance(attendance: Omit<Attendance, 'id'>): Observable<Attendance> {
    const newAttendance: Attendance = {
      ...attendance,
      id: this.nextId++
    };
    
    this.mockAttendance.push(newAttendance);
    return of(newAttendance);
  }

  // Update attendance record
  updateAttendance(attendance: Attendance): Observable<Attendance> {
    const index = this.mockAttendance.findIndex(a => a.id === attendance.id);
    if (index !== -1) {
      this.mockAttendance[index] = attendance;
      return of(attendance);
    }
    // Return an empty attendance object instead of null to match type
    return of({
      id: -1,
      employeeId: -1,
      date: '',
      checkInTime: '',
      status: 'absent'
    });
  }

  // Delete attendance record
  deleteAttendance(id: number): Observable<boolean> {
    const index = this.mockAttendance.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAttendance.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Calculate attendance statistics for an employee
  calculateAttendanceStats(employeeId: number): Observable<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    leaveDays: number;
    attendanceRate: number;
  }> {
    return this.getAttendanceByEmployeeId(employeeId).pipe(
      map(attendance => {
        const totalDays = attendance.length;
        const presentDays = attendance.filter(a => a.status === 'present').length;
        const absentDays = attendance.filter(a => a.status === 'absent').length;
        const lateDays = attendance.filter(a => a.status === 'late').length;
        const leaveDays = attendance.filter(a => a.status === 'on-leave').length;
        const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
        
        return {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          leaveDays,
          attendanceRate
        };
      })
    );
  }
}