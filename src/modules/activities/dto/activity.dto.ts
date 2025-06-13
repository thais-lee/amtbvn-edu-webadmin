import { TUser } from '@/modules/users/user.model';
import { TPaginationInput } from '@/shared/types/pagination-input.type';
import { TSearchInput } from '@/shared/types/search-input.type';

import { TActivity } from '../activity.model';

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

export enum EActivityQuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
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
  correctAnswer?: string;
  createdAt?: Date;
  updatedAt?: Date;
  activityId?: number;
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

//attempts

export interface TActivityAttempt {
  id?: number;
  activityId?: number;
  studentId?: number;
  attemptNumber?: number;
  startedAt?: Date;
  completedAt?: Date;
  graderId?: number;
  gradedAt?: Date;
  graderFeedback?: string;
  gradingStatus?: EActivityAttemptGradingStatus;
  score?: number;
  status?: string;
  student: TUser;
  activity: TActivity;
}

export interface TActivityAttemptAnswer {
  id?: number;
  activityAttemptId?: number;
  activityQuestionId?: number;
  selectedOptionId?: number;
  answer?: string;
  fileId?: number;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
  question: TActivityQuestion;
}

export interface TAttemptDetailDto extends TActivityAttempt {
  answers: TActivityAttemptAnswer[];
}

export interface TGetAttemptDto extends TPaginationInput, TSearchInput {
  activityId?: number;
  studentId?: number;
}

export enum EActivityAttemptGradingStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_AUTO = 'PENDING_AUTO',
  PENDING_MANUAL = 'PENDING_MANUAL',
  GRADED = 'GRADED',
}

export interface TAnswerGradeDto {
  id: number;
  score: number;
  feedback?: string;
}

export interface TGradeAttemptDto {
  overallFeedback?: string;
  answers: TAnswerGradeDto[];
}
