export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkInTime: string | undefined; // Making it explicitly allow undefined
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
  notes?: string;
  duration?: string; // Total working hours for the day
}