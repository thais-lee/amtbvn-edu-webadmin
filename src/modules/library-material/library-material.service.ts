import httpService from '@/shared/http-service';

import {
  TCreateLibraryMaterial,
  TUpdateLibraryMaterial,
} from './dto/library-material.dto';
import { TLibraryMaterial } from './library-material.model';

class LibraryMaterialService {
  getLibraryMaterials = async (): Promise<TLibraryMaterial[]> => {
    const response = await httpService.request<TLibraryMaterial[]>({
      url: '/library-materials',
      method: 'GET',
    });
    return response.data;
  };

  getLibraryMaterial = async (id: number): Promise<TLibraryMaterial> => {
    const response = await httpService.request<TLibraryMaterial>({
      url: `/library-materials/${id}`,
      method: 'GET',
    });
    return response.data;
  };

  createLibraryMaterial = async (
    libraryMaterial: TCreateLibraryMaterial,
  ): Promise<TLibraryMaterial> => {
    const response = await httpService.request<TLibraryMaterial>({
      url: '/library-materials',
      method: 'POST',
      data: libraryMaterial,
    });
    return response.data;
  };

  updateLibraryMaterial = async (
    id: number,
    libraryMaterial: TUpdateLibraryMaterial,
  ): Promise<TLibraryMaterial> => {
    const response = await httpService.request<TLibraryMaterial>({
      url: `/library-materials/${id}`,
      method: 'PUT',
      data: libraryMaterial,
    });

    return response.data;
  };

  deleteLibraryMaterial = async (id: number): Promise<void> => {
    await httpService.request<void>({
      url: `/library-materials/${id}`,
      method: 'DELETE',
    });
  };
}

export default new LibraryMaterialService();
