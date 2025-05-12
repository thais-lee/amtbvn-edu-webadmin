import { create } from 'zustand';

import { TUser } from '@/modules/users/user.model';

type TAuthState = {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
};

type TAuthActions = {
  setUser: (user: TUser | null) => void;
  logout: () => void;
  setTokens: (tokens: {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: string;
    refreshTokenExpiresAt?: string;
  }) => void;
};

export const useAuthStore = create<TAuthState & TAuthActions>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  setUser: (user: TUser | null) => set({ user }),
  logout: () => set({ user: null }),
  setTokens: (tokens) => set(tokens),
}));
