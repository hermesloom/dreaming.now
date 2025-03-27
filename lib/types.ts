export interface Profile {
  id: string;
  isAdmin: boolean;
}

export interface Session {
  profile: Profile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface BudgetItem {
  id: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface Pledge {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface Bucket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  budgetItems: BudgetItem[];
  pledges: Pledge[];
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  buckets: Bucket[];
  fundsLeft: number;
  currency: string;
}
