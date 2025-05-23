import { ArticleStatus, ArticlesType } from '@/shared/types/article.type';

export interface TArticleImage {
  id: number;
  fileId: number;
  order: number;
  file: {
    id: number;
    url: string;
  };
}

export interface TArticle {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  type: ArticlesType;
  status: ArticleStatus;
  likeCount: number;
  viewCount: number;
  images: TArticleImage[];
  user: {
    id: number;
    firstName: string;
    lastName: string;
    avatarImageFileUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}
