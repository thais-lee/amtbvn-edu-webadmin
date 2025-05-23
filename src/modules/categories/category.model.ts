export type TCategory = {
  id: number;
  name: string;
  parentId: number | null;
  imageUrl: string | null;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TSubCategory = TCategory & {
  subCategories: TCategory[];
};
