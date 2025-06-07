import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import {
  TCreateLibraryMaterialDto,
  TGetLibraryMaterialsDto,
  TUpdateLibraryMaterialDto,
} from './dto/library-material.dto';
import { TLibraryMaterial } from './library-materials.model';

interface TPaginatedResponse<T> {
  items: T[];
  total: number;
}

class LibraryMaterialsService {
  getLibraryMaterials = (input: TGetLibraryMaterialsDto) => {
    return httpService.request<TPaginated<TLibraryMaterial>>({
      url: '/api/library-materials',
      method: 'GET',
      params: input,
    });
  };

  getLibraryMaterial = async (id: number) => {
    const response = await httpService.request<TLibraryMaterial>({
      url: `/api/library-materials/${id}`,
      method: 'GET',
    });
    return response.data;
  };

  createLibraryMaterial = async (formData: FormData) => {
    const response = await httpService.request<TLibraryMaterial>({
      url: '/api/library-materials/create',
      method: 'POST',
      data: formData,
      contentType: 'multipart/form-data',
    });
    return response.data;
  };

  updateLibraryMaterial = async (
    id: number,
    input: TUpdateLibraryMaterialDto,
  ) => {
    const response = await httpService.request<TLibraryMaterial>({
      url: `/api/library-materials/${id}`,
      method: 'PUT',
      data: input,
    });
    return response.data;
  };

  deleteLibraryMaterial = async (id: number) => {
    const response = await httpService.request<TLibraryMaterial>({
      url: `/api/library-materials/${id}`,
      method: 'DELETE',
    });
    return response.data;
  };

  deleteManyLibraryMaterials = async (ids: number[]) => {
    const response = await httpService.request<TLibraryMaterial[]>({
      url: '/api/library-materials/delete-many',
      method: 'DELETE',
      data: ids,
    });
    return response.data;
  };
}

export default new LibraryMaterialsService();
