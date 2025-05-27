export interface TGetLibraryMaterial {
  search?: string;
  take?: number;
  skip?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  courseId?: number;
}

export interface TCreateLibraryMaterial {
  title: string;
  description: string;
  type: string;
  url: string;
  courseId: number;
}

export interface TUpdateLibraryMaterial {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  courseId?: number;
}
