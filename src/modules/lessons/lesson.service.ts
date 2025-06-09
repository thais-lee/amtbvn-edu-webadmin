import httpService from '@/shared/http-service';

import {
  TCreateLessonDto,
  TDetailLessonDto,
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
    return httpService.request<TDetailLessonDto>({
      url: `/api/lessons/${id}`,
      method: 'GET',
    });
  }

  createLesson(
    data: TCreateLessonDto & {
      mediaFileIds?: number[];
      documentFileIds?: number[];
    },
  ) {
    return httpService.request<TLesson>({
      url: '/api/lessons',
      method: 'POST',
      data,
    });
  }

  updateLesson(
    id: number,
    data: TUpdateLessonDto & {
      mediaFileIds?: number[];
      documentFileIds?: number[];
    },
  ) {
    return httpService.request<TLesson>({
      url: `/api/lessons/${id}`,
      method: 'PATCH',
      data,
    });
  }

  deleteLesson(id: number) {
    return httpService.request<void>({
      url: `/api/lessons/${id}`,
      method: 'DELETE',
    });
  }

  async deleteFile(fileId: number) {
    return httpService.request<void>({
      url: `/api/files/${fileId}`,
      method: 'DELETE',
    });
  }
}

export default new LessonService();
