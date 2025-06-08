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
  status?: EEnrollmentStatus;
}

export enum EEnrollmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}
