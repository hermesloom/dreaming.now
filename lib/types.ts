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
