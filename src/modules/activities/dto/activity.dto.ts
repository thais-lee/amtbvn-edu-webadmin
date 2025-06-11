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
  courseId?: number;
  lessonId?: number;
  dueDate?: Date;
  maxAttempts?: number;
  passScore?: number;
  timeLimitMinutes?: number;
  questions?: TCreateQuestionDto[];
}

export interface TCreateQuestionDto {
  question: string;
  type: string;
  options: TCreateOptionDto[];
}

export interface TCreateOptionDto {
  text: string;
  isCorrect: boolean;
}

export interface TUpdateActivityDto {
  title?: string;
  description?: string;
  type?: EActivityType;
  status?: EActivityStatus;
  timeLimitMinutes?: number;
  courseId?: number;
  lessonId?: number;
  dueDate?: Date;
  maxAttempts?: number;
  passScore?: number;
  questions?: TUpdateQuestionDto[];
}

export interface TUpdateQuestionDto {
  id?: number;
  question?: string;
  type?: string;
  options?: TUpdateQuestionOptionDto[];
  points?: number;
}

export interface TActivityQuestion {
  id?: number;
  question: string;
  type: string;
  points?: number;
  options: TActivityQuestionOption[];
}

export interface TActivityQuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
}

export interface TUpdateQuestionOptionDto {
  id?: number;
  text?: string;
  isCorrect?: boolean;
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
