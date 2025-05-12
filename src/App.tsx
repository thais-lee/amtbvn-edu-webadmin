import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { App as AntdApp, ConfigProvider, Spin } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { useTranslation } from 'react-i18next';

import { useAppStore } from './modules/app/app.zustand';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const { i18n } = useTranslation();

  const locale = i18n.language === 'en' ? enUS : viVN;

  const theme = useAppStore((state) => state.theme);
  const loading = useAppStore((state) => state.loading);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={locale}>
        <AntdApp>
          <Spin fullscreen spinning={loading} />
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
