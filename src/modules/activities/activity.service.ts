import httpService from '@/shared/http-service';

import { TActivity } from './activity.model';
import {
  TCreateActivityDto,
  TGetActivityDto,
  TUpdateActivityDto,
} from './dto/activity.dto';

class ActivityService {
  getAllActivities(input?: TGetActivityDto) {
    return httpService.request<TActivity[]>({
      url: '/api/activities/',
      method: 'GET',
      params: input,
    });
  }

  getOne(id: number) {
    return httpService.request<TActivity>({
      url: `/api/activities/admin/get-by-id/${id}`,
      method: 'GET',
    });
  }

  createActivity(data: TCreateActivityDto) {
    return httpService.request<TActivity>({
      url: '/api/activities/admin/create',
      method: 'POST',
      data,
    });
  }

  updateActivity(id: number, data: TUpdateActivityDto) {
    return httpService.request<TActivity>({
      url: `/api/activities/admin/update/${id}`,
      method: 'PUT',
      data,
    });
  }

  deleteActivity(id: number) {
    return httpService.request<TActivity>({
      url: `/api/activities/admin/delete/${id}`,
      method: 'DELETE',
    });
  }
}

export default new ActivityService();
