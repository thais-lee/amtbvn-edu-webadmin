import { TPaginationInput } from '@/shared/types/pagination-input.type';
import { TSearchInput } from '@/shared/types/search-input.type';
import { TSortedInput } from '@/shared/types/sorted-input.type';

export type TGetUsersDto = TPaginationInput & TSortedInput & TSearchInput;
