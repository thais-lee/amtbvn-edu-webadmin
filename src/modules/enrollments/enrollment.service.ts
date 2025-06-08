import httpService from '@/shared/http-service';

import {
  TCreateEnrollmentDto,
  TGetEnrollmentDto,
  TUpdateEnrollmentDto,
} from './dto/enrollment.dto';
import { TEnrollment } from './enrollment.model';

class EnrollmentService {
  getAllEnrollments(input?: TGetEnrollmentDto) {
    return httpService.request<TEnrollment[]>({
      url: '/api/enrollments/',
      method: 'GET',
      params: input,
    });
  }

  adminCreateEnrollment(data: TCreateEnrollmentDto) {
    return httpService.request<TEnrollment>({
      url: '/api/enrollments',
      method: 'POST',
      data,
    });
  }

  createEnrollment(data: TCreateEnrollmentDto) {
    return httpService.request<TEnrollment>({
      url: '/api/enrollments/student',
      method: 'POST',
      data,
    });
  }

  updateEnrollment(query: TGetEnrollmentDto, data: TUpdateEnrollmentDto) {
    return httpService.request<TEnrollment>({
      url: `/api/enrollments/update`,
      method: 'PATCH',
      params: query,
      data,
    });
  }

  deleteEnrollment(query: TGetEnrollmentDto) {
    return httpService.request<TEnrollment>({
      url: `/api/enrollments/delete`,
      params: query,
      method: 'DELETE',
    });
  }
}

export default new EnrollmentService();
