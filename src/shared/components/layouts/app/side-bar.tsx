import {
  AppstoreOutlined,
  DeploymentUnitOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import type { MenuProps } from 'antd';
import { Layout, Menu, Typography, theme } from 'antd';
import { useMemo } from 'react';
import { useLocation } from 'react-use';

import { APP_NAME, SIDE_NAV_WIDTH } from '@/configs/constants';
import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import { TAntdToken } from '@/shared/types/tst.type';

type TMainSideNavProps = {
  collapsed: boolean;
  setCollapsed: (_collapsed: boolean) => void;
};

const MainSideNav = ({ collapsed, setCollapsed }: TMainSideNavProps) => {
  const { t } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const gTheme = useAppStore((state) => state.theme);
  const isDark = gTheme.algorithm.includes(theme.darkAlgorithm);

  const { token } = theme.useToken();

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: '/dashboard',
        icon: <AppstoreOutlined />,
        label: t('Dashboard'),
      },
      {
        key: '/users',
        icon: <TeamOutlined />,
        label: t('Users'),
      },
      {
        key: '/projects',
        icon: <DeploymentUnitOutlined />,
        label: t('Projects'),
      },
    ],
    [t],
  );

  const onClick: MenuProps['onClick'] = (e) => {
    navigate({ to: e.key } as any);
  };

  return (
    <Layout.Sider
      width={SIDE_NAV_WIDTH}
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme={isDark ? 'light' : 'dark'}
    >
      <LogoWrapper $token={token} onClick={() => navigate({ to: '/' })}>
        <img
          src="/assets/images/logo.png"
          alt="logo"
          width={80 - token.padding}
          css={css`
            background: linear-gradient(
              45deg,
              ${token.colorPrimary},
              ${token.colorWhite}
            );
            padding: ${collapsed ? token.padding : token.padding / 2}px;
            border-radius: ${token.borderRadius}px;
            transition: ease-in-out 1s;
            margin-right: ${collapsed ? 0 : token.margin / 2}px;
          `}
        />

        {!collapsed && (
          <Typography.Text
            css={css`
              color: ${token.colorWhite};
              font-size: ${token.fontSizeHeading5}px;
              font-weight: ${token.fontWeightStrong};
            `}
          >
            {APP_NAME}
          </Typography.Text>
        )}
      </LogoWrapper>

      <Menu
        onClick={onClick}
        theme={isDark ? 'light' : 'dark'}
        mode="inline"
        items={items}
        selectedKeys={['/' + location.pathname?.split('/')[1]]}
        css={css`
          border-inline-end: none;
        `}
      />
    </Layout.Sider>
  );
};

export default MainSideNav;

const LogoWrapper = styled.div<TAntdToken>`
  cursor: pointer;
  width: 100%;
  padding: ${(props) => props.$token.padding / 2}px;
  display: flex;
  align-items: center;
`;
