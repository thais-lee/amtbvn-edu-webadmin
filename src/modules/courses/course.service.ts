import httpService from '@/shared/http-service';

import {
  TCourse,
  TCourseCreate,
  TCourseDetail,
  TCourseQuery,
  TCourseUpdate,
} from './course.model';

class CourseService {
  getAllCourses(params?: TCourseQuery) {
    return httpService.request<TCourse[]>({
      url: '/api/courses/admin/all',
      method: 'GET',
      params,
    });
  }

  getCourseById(id: number) {
    return httpService.request<TCourse>({
      url: `/api/courses/${id}`,
      method: 'GET',
    });
  }

  getCourseBySlug(slug: string) {
    return httpService.request<TCourseDetail>({
      url: `/api/courses/admin/get-by-slug/${slug}`,
      method: 'GET',
    });
  }

  createCourse(data: TCourseCreate) {
    return httpService.request<TCourse>({
      url: '/api/courses',
      method: 'POST',
      data,
    });
  }

  updateCourse(id: number, data: TCourseUpdate) {
    return httpService.request<TCourse>({
      url: `/api/courses/${id}`,
      method: 'PATCH',
      data,
    });
  }

  deleteCourse(id: number) {
    return httpService.request<TCourse>({
      url: `/api/courses/${id}`,
      method: 'DELETE',
    });
  }
}

export default new CourseService();
