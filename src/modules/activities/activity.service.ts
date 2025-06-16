import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TActivity } from './activity.model';
import {
  TActivityAttempt,
  TAttemptDetailDto,
  TGetActivityDto,
  TGetAttemptDto,
  TGradeAttemptDto,
} from './dto/activity.dto';

class ActivityService {
  getAllActivities(input?: TGetActivityDto) {
    return httpService.request<TPaginated<TActivity>>({
      url: '/api/activities/',
      method: 'GET',
      params: input,
    });
  }

  getAttempts(input?: TGetAttemptDto) {
    return httpService.request<TPaginated<TActivityAttempt>>({
      url: '/api/activities/attempts/admin/list',
      method: 'GET',
      params: input,
    });
  }

  getAttemptDetail(id: number) {
    return httpService.request<TAttemptDetailDto>({
      url: `/api/activities/attempts/admin/${id}`,
      method: 'GET',
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

  gradeAttempt(id: number, data: TGradeAttemptDto) {
    return httpService.request<TActivityAttempt>({
      url: `/api/activities/attempts/admin/${id}/grade`,
      method: 'POST',
      data,
    });
  }
}

export default new ActivityService();
