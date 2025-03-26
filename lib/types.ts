export interface Profile {
  id: string;
  funds: number;
}

export interface Session {
  profile: Profile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}
