import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TCategory, TSubCategory } from './category.model';
import { TGetCategoriesDto } from './dto/get-category.dto';

class CategoryService {
  getOne(id: number) {
    return httpService.request<TCategory>({
      url: `/api/categories/${id}`,
      method: 'GET',
    });
  }

  getBySlug(slug: string) {
    return httpService.request<TCategory>({
      url: `/api/categories/by-slug/${slug}`,
      method: 'GET',
    });
  }

  getAllCategories(input: TGetCategoriesDto) {
    return httpService.request<TPaginated<TCategory>>({
      url: '/api/categories/all',
      method: 'GET',
      params: input,
    });
  }

  getSubCategories(input: TGetCategoriesDto & { slug?: string }) {
    return httpService.request<TSubCategory>({
      url: `/api/categories/by-slug/${input.slug}`,
      method: 'GET',
    });
  }

  getCategoryPath(slug: string) {
    return httpService.request<TCategory[]>({
      url: `/api/categories/by-slug/${slug}/path`,
      method: 'GET',
    });
  }

  createCategory(data: TCategory) {
    return httpService.request<TCategory>({
      url: '/api/categories/admin-create',
      method: 'POST',
      data,
    });
  }

  updateCategory(id: number, data: TCategory) {
    return httpService.request<TCategory>({
      url: `/api/categories/admin-update/${id}`,
      method: 'PATCH',
      data,
    });
  }

  deleteCategory(id: number) {
    return httpService.request<TCategory>({
      url: `/api/categories/admin-delete/${id}`,
      method: 'DELETE',
    });
  }

  deleteManyCategories(ids: number[]) {
    console.log(ids);

    return httpService.request<TCategory>({
      url: '/api/categories/admin-delete-many',
      method: 'DELETE',
      data: {
        ids,
      },
    });
  }
}

export default new CategoryService();
