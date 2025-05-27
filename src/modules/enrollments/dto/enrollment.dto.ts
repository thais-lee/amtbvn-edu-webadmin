export interface TGetEnrollmentDto {
  search?: string;
  take?: number;
  skip?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  courseId?: number;
  userId?: number;
  status?: string;
}

export interface TCreateEnrollmentDto {
  courseId: number;
  userId: number;
  status: string;
}

export interface TUpdateEnrollmentDto {
  courseId?: number;
  userId?: number;
  status?: string;
}
