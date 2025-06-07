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
  title: string;
  content: string;
  isImportant: boolean;
  status: LessonStatus;
  courseId: number;
  previousId?: number;
}

export interface TUpdateLessonDto {
  title?: string;
  content?: string;
  isImportant?: boolean;
  status?: LessonStatus;
  courseId?: number;
  previousId?: number;
}
