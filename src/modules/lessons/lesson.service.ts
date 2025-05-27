import httpService from '@/shared/http-service';

import {
  TCreateLessonDto,
  TGetLessonDto,
  TUpdateLessonDto,
} from './dto/lesson.dto';
import { TLesson } from './lesson.model';

class LessonService {
  getAllLessons(input?: TGetLessonDto) {
    return httpService.request<TLesson[]>({
      url: '/api/lessons/',
      method: 'GET',
      params: input,
    });
  }

  getOne(id: number) {
    return httpService.request<TLesson>({
      url: `/api/lessons/admin/get-by-id/${id}`,
      method: 'GET',
    });
  }

  createLesson(data: TCreateLessonDto) {
    return httpService.request<TLesson>({
      url: '/api/lessons/admin/create',
      method: 'POST',
      data,
    });
  }

  updateLesson(id: number, data: TUpdateLessonDto) {
    return httpService.request<TGetLessonDto>({
      url: `/api/lessons/admin/update/${id}`,
      method: 'PUT',
      data,
    });
  }
}

export default new LessonService();
