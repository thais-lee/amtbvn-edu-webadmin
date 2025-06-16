import Cookies from 'js-cookie';

import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_KEY_EXPIRES_AT,
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_KEY_EXPIRES_AT,
} from '@/configs/constants';
import { TUser } from '@/modules/users/user.model';
import httpService from '@/shared/http-service';

import { TLoginInput, TLoginResponse, TRegisterInput } from './auth.model';

class AuthService {
  public async login(input: TLoginInput) {
    const result = await httpService.requestNoAuth<TLoginResponse>({
      url: '/api/auth/token-auth',
      method: 'POST',
      data: input,
    });

    Cookies.set(ACCESS_TOKEN_KEY, result.data.accessToken);
    Cookies.set(REFRESH_TOKEN_KEY, result.data.refreshToken);
    Cookies.set(
      ACCESS_TOKEN_KEY_EXPIRES_AT,
      new Date(
        Date.now() + result.data.accessTokenExpiresIn * 1000,
      ).toISOString(),
    );
    Cookies.set(
      REFRESH_TOKEN_KEY_EXPIRES_AT,
      new Date(
        Date.now() + result.data.refreshTokenExpiresIn * 1000,
      ).toISOString(),
    );

    return this.getMe();
  }

  async register(input: TRegisterInput) {
    const isSuccess = await httpService.requestNoAuth<boolean>({
      url: '/api/auth/register',
      method: 'POST',
      data: input,
    });

    if (isSuccess) {
      return this.login({
        usernameOrEmail: input.username,
        password: input.password,
      });
    } else {
      return null;
    }
  }

  async logout() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(ACCESS_TOKEN_KEY_EXPIRES_AT);
    Cookies.remove(REFRESH_TOKEN_KEY_EXPIRES_AT);
  }

  async refreshToken() {
    try {
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
      const refreshTokenExpiresAt = Cookies.get(REFRESH_TOKEN_KEY_EXPIRES_AT);

      if (
        !refreshToken ||
        !refreshTokenExpiresAt ||
        new Date(refreshTokenExpiresAt) < new Date()
      ) {
        return false;
      }

      const response = await httpService.requestNoAuth<TLoginResponse>({
        url: '/api/auth/refresh-token',
        method: 'POST',
        data: {
          refreshToken,
        },
      });

      Cookies.set(ACCESS_TOKEN_KEY, response.data.accessToken);
      Cookies.set(
        ACCESS_TOKEN_KEY_EXPIRES_AT,
        new Date(
          Date.now() + response.data.accessTokenExpiresIn * 1000,
        ).toISOString(),
      );

      return;
    } catch (error) {
      return error;
    }
  }

  async getMe() {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      throw new Error('Access token is not found');
    }

    return await httpService.request<TUser>({
      url: '/api/auth/me',
      method: 'GET',
    });
  }
}

const authService = new AuthService();

export default authService;
