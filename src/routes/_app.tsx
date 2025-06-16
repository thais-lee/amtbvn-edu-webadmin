import { css } from '@emotion/react';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Layout, Spin } from 'antd';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import { useAuth } from '@/hooks/use-auth';
// import { messaging } from '@/modules/firebase';
// import { EAppType } from '@/modules/firebase/dto/fcm-token.dto';
// import firebaseService from '@/modules/firebase/firebase.service';
// import { requestFcmPermission } from '@/modules/firebase/request-permission';
import MainSideNav from '@/shared/components/layouts/app/side-bar';
import MainTopBar from '@/shared/components/layouts/app/top-bar';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();

  const authQuery = useAuth();

  const { token } = useApp();

  const [collapsed, setCollapsed] = useState(false);

  // On message of fcm
  //   onMessage(messaging, (payload) => {
  //     antdApp.notification.open({
  //       message: payload.notification?.title,
  //       description: (
  //         <Space>
  //           {payload.notification?.body}
  //           <Image src={payload.notification?.image} width={64} />
  //         </Space>
  //       ),
  //       onClick: () => {},
  //     });
  //   });

  useEffect(() => {
    if (authQuery.isError) {
      navigate({ to: '/auth/login' });
    }
  }, [authQuery.isError, navigate]);

  //   const sendTokenMutation = useMutation({
  //     mutationFn: (token: string) =>
  //       firebaseService.createFcmToken({ token, appType: EAppType.NBYD_WEBAPP }),
  //   });

  //   useEffect(() => {
  //     if (authQuery.isSuccess) {
  //       requestFcmPermission().then((token) => {
  //         if (token) {
  //           sendTokenMutation.mutate(token);
  //         }
  //       });
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [authQuery.isSuccess]);

  return authQuery.isSuccess ? (
    <Layout
      hasSider
      css={css`
        min-height: 100dvh;
      `}
    >
      <MainSideNav collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <MainTopBar collapsed={collapsed} setCollapse={setCollapsed} />

        <Layout.Content
          className="main-content"
          css={css`
            margin: ${token.margin}px;
            padding: ${token.padding}px;
            background-color: ${token.colorBgContainer};
            border-radius: ${token.borderRadius}px;
            height: calc(100dvh - 64px - 2 * ${token.margin}px);
            overflow-y: auto;
            overflow: -moz-scrollbars-none;
            -ms-overflow-style: none;
          `}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  ) : (
    <Layout
      css={css`
        min-height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <Spin size="large" />
    </Layout>
  );
}
