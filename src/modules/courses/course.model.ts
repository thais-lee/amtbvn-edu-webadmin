import { TActivity } from '../activities/activity.model';
import { TAttachment } from '../attachments/attachment.model';
import { TCategory } from '../categories/category.model';
import { TEnrollment } from '../enrollments/enrollment.model';
import { TLesson } from '../lessons/lesson.model';

export interface TCourse {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  imageFileUrl?: string;
  bannerFileUrl?: string;
  categoryId: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface TCourseDetail extends TCourse {
  category: TCategory;
  enrollments: TEnrollment[];
  lessons: TLesson[];
  activities: TActivity[];
  attachments: TAttachment[];
}

export interface TCourseCreate {
  name: string;
  description?: string;
  slug?: string;
  categoryId: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface TCourseUpdate {
  name?: string;
  description?: string;
  slug?: string;
  categoryId?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface TCourseQuery {
  take?: number;
  skip?: number;
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}
