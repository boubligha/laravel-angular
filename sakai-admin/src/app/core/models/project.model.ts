export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  deadline: string;
  budget?: number;
  priority: 'High' | 'Medium' | 'Low';
  pm: {
    id?: number;
    name: string;
    avatar: string;
  };
  tl: {
    id?: number;
    name: string;
    avatar: string;
  };
  team: {
    id?: number;
    name: string;
    avatar: string;
  }[];
  status: 'Delayed' | 'Ongoing' | 'Not Started' | 'Completed';
  progress: number;
}