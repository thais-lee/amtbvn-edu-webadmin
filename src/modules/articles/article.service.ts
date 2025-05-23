import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TArticle } from './article.model';
import { TCreateArticleDto, TGetArticlesDto, TUpdateArticleDto } from './dto/article.dto';

class ArticleService {
  getOne(id: number) {
    return httpService.request<TArticle>({
      url: `/api/articles/${id}`,
      method: 'GET',
    });
  }

  getAllArticles(input: TGetArticlesDto) {
    return httpService.request<TPaginated<TArticle>>({
      url: '/api/articles',
      method: 'GET',
      params: input,
    });
  }

  createArticle(data: TCreateArticleDto) {
    return httpService.request<TArticle>({
      url: '/api/articles',
      method: 'POST',
      data,
    });
  }

  updateArticle(id: number, data: TUpdateArticleDto) {
    return httpService.request<TArticle>({
      url: `/api/articles/${id}`,
      method: 'PATCH',
      data,
    });
  }

  deleteArticle(id: number) {
    return httpService.request<TArticle>({
      url: `/api/articles/${id}`,
      method: 'DELETE',
    });
  }

  deleteManyArticles(ids: number[]) {
    return httpService.request<TArticle>({
      url: '/api/articles/delete-many',
      method: 'DELETE',
      data: {
        ids,
      },
    });
  }
}

export default new ArticleService();
