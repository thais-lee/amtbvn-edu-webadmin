import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TEnrollment } from '../enrollments/enrollment.model';
import {
  TCourse,
  TCourseCreate,
  TCourseDetail,
  TCourseItem,
  TCourseQuery,
  TCourseUpdate,
} from './course.model';
import { TGetCourseMemberDto } from './dto/course.dto';

class CourseService {
  getAllCourses(params?: TCourseQuery) {
    return httpService.request<TPaginated<TCourseItem>>({
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

  getCourseEnrollments(input: TGetCourseMemberDto) {
    return httpService.request<TPaginated<TEnrollment>>({
      url: `/api/courses/member`,
      method: 'GET',
      params: input,
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
