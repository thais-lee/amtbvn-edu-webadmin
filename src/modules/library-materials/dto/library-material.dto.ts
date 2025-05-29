import { TPaginationInput } from '@/shared/types/pagination-input.type';
import { TSearchInput } from '@/shared/types/search-input.type';
import { TSortedInput } from '@/shared/types/sorted-input.type';

export type TGetLibraryMaterialsDto = TPaginationInput &
  TSortedInput &
  TSearchInput & {
    categoryId?: number;
  };

export interface TCreateLibraryMaterialDto {
  title: string;
  description?: string;
  tags: string[];
  categoryId: number;
}

export interface TUpdateLibraryMaterialDto {
  title?: string;
  description?: string;
  tags?: string[];
  categoryId?: number;
}
