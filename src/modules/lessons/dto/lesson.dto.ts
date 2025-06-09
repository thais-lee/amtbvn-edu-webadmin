import { TFile } from '@/modules/files/file.model';

import { TLesson } from '../lesson.model';

export interface TGetLessonDto {
  search?: string;
  take?: number;
  skip?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  courseId?: number;
  status?: ELessonStatus;
  previousId?: number;
}

export enum ELessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface TCreateLessonDto {
  title: string;
  content: string;
  isImportant: boolean;
  status: ELessonStatus;
  courseId: number;
  previousId?: number;
  mediaFiles?: File[];
  documentFiles?: File[];
}

export interface TUpdateLessonDto {
  title?: string;
  content?: string;
  isImportant?: boolean;
  status?: ELessonStatus;
  courseId?: number;
  previousId?: number;
  mediaFiles?: File[];
  documentFiles?: File[];
}

export enum ELessonAttachmentType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

export interface TLessonAttachment {
  fileId: number;
  type: ELessonAttachmentType;
  file: TFile;
}

export interface TDetailLessonDto extends TLesson {
  attachments: TLessonAttachment[];
}
