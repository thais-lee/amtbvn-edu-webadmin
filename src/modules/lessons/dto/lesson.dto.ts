export interface TGetLessonDto {
  search?: string;
  take?: number;
  skip?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  courseId?: number;
  status?: LessonStatus;
  previousId?: number;
}

export enum LessonStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
}

export interface TCreateLessonDto {
  name: string;
  description: string;
}

export interface TUpdateLessonDto {
  name?: string;
  description?: string;
}
