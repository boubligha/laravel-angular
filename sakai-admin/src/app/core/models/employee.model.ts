export interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  imageUrl?: string;
  status?: 'online' | 'absent' | 'on-leave' | 'half-day';
  leaveType?: string;
  workHours?: {
    inTime: string;
    outTime: string;
    breakTime: string;
    workHours: string;
  };
}