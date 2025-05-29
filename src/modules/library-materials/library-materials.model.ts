import { TCategory } from '../categories/category.model';
import { TFile } from '../files/file.model';

export interface TLibraryMaterial {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  tags: string[];
  categoryId: number;
  category: TCategory;
  files: TFile[];
  createdAt: string;
  updatedAt: string;
}
