import { Timestamp } from 'firebase/firestore';

export type UserRole = 'worker' | 'ngo' | 'verifier' | 'admin';

export interface Location {
  lat: number;
  lng: number;
}

export interface Wallet {
  mealCredits: number;
}

export interface User {
  uid: string;
  name: string;
  phone: string;
  role: UserRole;
  location?: Location;
  wallet: Wallet;
  verified: boolean;
  photoUrl?: string;
  createdAt: Timestamp | Date;
}

export type OrgType = 'NGO' | 'shop' | 'donor';

export interface Organization {
  id: string;
  name: string;
  contactPhone: string;
  address: string;
  type: OrgType;
  verified: boolean;
  createdAt: Timestamp | Date;
}

export type TaskStatus = 'open' | 'claimed' | 'submitted' | 'verified' | 'cancelled';

export interface TaskProof {
  photoUrl: string;
  geo?: Location;
  submittedAt: Timestamp | Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  postedByOrg: string;
  postedByOrgName?: string; // Denormalized for display
  location: Location;
  rewardMeals: number;
  status: TaskStatus;
  claimedBy?: string;
  claimedByName?: string; // Denormalized for display
  proof?: TaskProof;
  verifiedAt?: Timestamp | Date;
  createdAt: Timestamp | Date;
  dueBy: Timestamp | Date;
}

export type RedemptionStatus = 'requested' | 'completed' | 'rejected';

export interface Redemption {
  id: string;
  userId: string;
  userName?: string; // Denormalized
  orgId: string;
  orgName?: string; // Denormalized
  mealCredits: number;
  status: RedemptionStatus;
  requestedAt: Timestamp | Date;
  completedAt?: Timestamp | Date;
  proofPhoto?: string;
  rejectionReason?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalMealsIssued: number;
  activeTasks: number;
  pendingVerifications: number;
}
