export interface TGetActivityDto {
  search?: string;
  take?: number;
  skip?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  courseId?: number;
  lessonId?: number;
  status?: string;
  type?: string;
}

export interface TCreateActivityDto {
  title: string;
  description: string;
  type: string;
  status: string;
  courseId: number;
  lessonId?: number;
}

export interface TUpdateActivityDto {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  courseId?: number;
  lessonId?: number;
}

export enum EActivityStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum EActivityType {
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  PROJECT = 'PROJECT',
  DISCUSSION = 'DISCUSSION',
}

export interface TCreateActivity {
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  courseId: number;
}

export interface TUpdateActivity {
  title?: string;
  description?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  courseId?: number;
}
