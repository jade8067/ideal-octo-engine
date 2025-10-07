export type TaskCategory = '家務助理' | '簡易維修' | '陪伴關懷' | '跑腿代辦';
export type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
export type TaskDuration = '30分鐘' | '1小時' | '2小時' | '半天';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  reward: number;
  location: string;
  posterName: string;
  posterTrustScore: number;
  requiresCertification: boolean;
  posterIsCertified: boolean;
  posterCertificationOrg?: string; // New field for poster's certification organization
  status: TaskStatus;
  estimatedDuration: TaskDuration;
  deadline?: string;
}

export interface User {
  name: string;
  avatarSeed: string;
  bio: string;
  isCertified: boolean;
  certificationOrg?: string; // New field for user's certification organization
  trustScore: number;
}