export interface TGetAttachment {
  search?: string;
  take?: number;
  skip?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  courseId?: number;
}

export interface TCreateAttachment {
  title: string;
  description: string;
  type: string;
  url: string;
  courseId: number;
}

export interface TUpdateAttachment {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  courseId?: number;
}
