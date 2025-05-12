import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);

  const getMe = async () => {
    try {
      const fetchedUser = await authService.getMe();
      setUser(fetchedUser.data);
      setTokens({
        accessToken: Cookies.get('accessToken'),
        refreshToken: Cookies.get('refreshToken'),
        accessTokenExpiresAt: Cookies.get('accessTokenExpiresAt'),
        refreshTokenExpiresAt: Cookies.get('refreshTokenExpiresAt'),
      });

      return user;
    } catch (error) {
      setUser(null);
    }
  };

  const authQuery = useQuery({
    enabled: !user,
    queryKey: ['/auth/getMe'],
    queryFn: () => getMe(),
    retry: false,
  });

  return authQuery;
};
