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

  getOne(id: number) {
    return httpService.request<TEnrollment>({
      url: `/api/enrollments/admin/get-by-id/${id}`,
      method: 'GET',
    });
  }

  createEnrollment(data: TCreateEnrollmentDto) {
    return httpService.request<TEnrollment>({
      url: '/api/enrollments/admin/create',
      method: 'POST',
      data,
    });
  }

  updateEnrollment(id: number, data: TUpdateEnrollmentDto) {
    return httpService.request<TEnrollment>({
      url: `/api/enrollments/admin/update/${id}`,
      method: 'PUT',
      data,
    });
  }

  deleteEnrollment(id: number) {
    return httpService.request<TEnrollment>({
      url: `/api/enrollments/admin/delete/${id}`,
      method: 'DELETE',
    });
  }
}

export default new EnrollmentService();
