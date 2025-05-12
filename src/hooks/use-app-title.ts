import { useTitle } from 'react-use';

import { APP_NAME } from '@/configs/constants';

export const useAppTitle = (name?: string) => {
  return useTitle(APP_NAME + (name ? ` | ${name}` : ''));
};
