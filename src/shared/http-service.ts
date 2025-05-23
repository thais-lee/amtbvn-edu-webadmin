import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from 'axios';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN_KEY, SERVER_BASE_URL } from '@/configs/constants';
import authService from '@/modules/auth/auth.service';

type THttpRequest = {
  url: string;
  method: Method;
  data?: any;
  params?: any;
  contentType?: string;
  paramsSerializer?: (params: any) => string;
};

export type THttpResponse<T> = {
  message: string | null;
  code: number;
  params: string | string[] | null;
  data: T;
};

class HttpService {
  public readonly httpWithAuth = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 30000,
  });
  private readonly httpNoAuth = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 30000,
  });
  private readonly httpLogout = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 30000,
  });

  constructor() {
    this.httpWithAuth.interceptors.request.use(
      async (config) => {
        const headers = config.headers;
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        return { ...config, headers: config.headers };
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.httpWithAuth.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

        if (!accessToken) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          const success = await authService.refreshToken();

          if (success) {
            return this.httpWithAuth(error.config as AxiosRequestConfig);
          } else {
            await authService.logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );

    this.httpLogout.interceptors.request.use(
      async (config) => {
        const headers: any = config.headers;
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        return { ...config, headers: config.headers };
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  async request<T>({
    url,
    params,
    data,
    method,
    contentType,
    paramsSerializer,
  }: THttpRequest): Promise<THttpResponse<T>> {
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        'Content-Type': contentType || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      paramsSerializer,
    };

    const response = await this.httpWithAuth.request<THttpResponse<T>>(config);

    return response.data;
  }

  async requestNoAuth<T>({
    url,
    params,
    data,
    method,
    contentType,
  }: THttpRequest): Promise<THttpResponse<T>> {
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        'Content-Type': contentType || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const response =
      await this.httpNoAuth.request<Promise<THttpResponse<T>>>(config);

    return response.data;
  }

  // async requestLogout<T>({
  //   url,
  //   params,
  //   data,
  //   method,
  //   contentType,
  // }: THttpRequest): Promise<T> {
  //   const config: AxiosRequestConfig = {
  //     url,
  //     method,
  //     params,
  //     data,
  //     headers: {
  //       'Content-Type': contentType || 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //   };

  //   const response = await this.httpLogout.request<T>(config);

  //   return response.data;
  // }
}

const httpService = new HttpService();

export default httpService;
