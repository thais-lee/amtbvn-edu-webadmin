import qs from 'qs';

import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TCreateUserDto } from './dto/create-user.dto';
import { TGetUsersDto } from './dto/get-users.dto';
import { TUpdateUserDto } from './dto/update-user.dto';
import { TUser } from './user.model';

class UserService {
  getPaginatedUsers(input: TGetUsersDto) {
    return httpService.request<TPaginated<TUser>>({
      url: '/api/users/admin-paginated',
      method: 'GET',
      params: input,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  createUser(input: TCreateUserDto) {
    return httpService.request<TUser>({
      url: '/api/users/admin-create',
      method: 'POST',
      data: input,
    });
  }

  getUser(id: number) {
    return httpService.request<TUser>({
      url: `/api/users/admin-one/${id}`,
      method: 'GET',
    });
  }

  updateUser(id: number, input: TUpdateUserDto) {
    return httpService.request<TUser>({
      url: `/api/users/admin-update/${id}`,
      method: 'PATCH',
      data: input,
    });
  }

  updateMe(input: TUpdateUserDto) {
    return httpService.request<TUser>({
      url: '/api/users/me',
      method: 'PATCH',
      data: input,
    });
  }

  deleteUser(id: number) {
    return httpService.request<TUser>({
      url: `/api/users/admin-delete/${id}`,
      method: 'DELETE',
    });
  }

  deleteUsers(ids: number[]) {
    return httpService.request<TUser>({
      url: '/api/users/admin-delete-many',
      method: 'DELETE',
      data: {
        ids,
      },
    });
  }

  changeAvatar(file: Blob) {
    return httpService.request<TUser>({
      url: '/api/users/avatar',
      method: 'PATCH',
      contentType: 'multipart/form-data',
      data: {
        file,
      },
    });
  }
}

export default new UserService();
