import { ArticleStatus, ArticlesType } from '@/shared/types/article.type';

export interface TArticleImageDto {
  fileId: number;
  order?: number;
}

export interface TCreateArticleDto {
  title: string;
  content: string;
  categoryId: number;
  type: ArticlesType;
  thumbnailUrl?: string;
  status?: ArticleStatus;
  images?: TArticleImageDto[];
}

export interface TUpdateArticleDto {
  title?: string;
  content?: string;
  categoryId?: number;
  type?: ArticlesType;
  thumbnailUrl?: string;
  status?: ArticleStatus;
  images?: TArticleImageDto[];
}

export interface TGetArticlesDto {
  take?: number;
  skip?: number;
  categoryId?: number;
  type?: ArticlesType;
  status?: ArticleStatus;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
}
