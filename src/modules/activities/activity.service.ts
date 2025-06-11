import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TActivity } from './activity.model';
import {
  TCreateActivityDto,
  TGetActivityDto,
  TUpdateActivityDto,
} from './dto/activity.dto';

class ActivityService {
  getAllActivities(input?: TGetActivityDto) {
    return httpService.request<TPaginated<TActivity>>({
      url: '/api/activities/',
      method: 'GET',
      params: input,
    });
  }

  getOne(id: number) {
    return httpService.request<TActivity>({
      url: `/api/activities/${id}`,
      method: 'GET',
    });
  }

  createActivity(data: FormData) {
    return httpService.request<TActivity>({
      url: '/api/activities',
      method: 'POST',
      data,
      contentType: 'multipart/form-data',
    });
  }

  updateActivity(id: number, data: FormData) {
    return httpService.request<TActivity>({
      url: `/api/activities/${id}`,
      method: 'PATCH',
      data,
      contentType: 'multipart/form-data',
    });
  }

  deleteActivity(id: number) {
    return httpService.request<TActivity>({
      url: `/api/activities/${id}`,
      method: 'DELETE',
    });
  }
}

export default new ActivityService();
