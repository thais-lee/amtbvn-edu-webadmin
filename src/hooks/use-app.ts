import { App, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/modules/app/app.zustand';

function useApp() {
  const { t } = useTranslation();

  const gTheme = useAppStore((state) => state.theme);
  const isDarkTheme = gTheme.algorithm.includes(theme.darkAlgorithm);

  const { token } = theme.useToken();
  const antdApp = App.useApp();

  return {
    t,
    isDarkTheme,
    token,
    antdApp,
  };
}

export default useApp;
