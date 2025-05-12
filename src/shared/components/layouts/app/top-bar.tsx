import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UnlockFilled,
  UserOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  MenuProps,
  Space,
  Switch,
  theme,
} from 'antd';
import { useCallback, useMemo } from 'react';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';

type TMainTopBarProps = {
  collapsed: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainTopBar = ({ collapsed, setCollapse }: TMainTopBarProps) => {
  const { t, token } = useApp();

  const gTheme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      navigate({
        to: '/auth/login',
      });
    },
    onError: () => {
      setUser(null);
      navigate({
        to: '/auth/login',
      });
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const dropItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to={'/profile'}>{t('Profile')}</Link>,
      },
      {
        key: 'logout',
        icon: <UnlockFilled />,
        label: <span onClick={() => handleLogout()}>{t('Logout')}</span>,
      },
    ],
    [t, handleLogout],
  );

  return (
    <Layout.Header
      css={css`
        background: ${token.colorBgContainer};
        display: flex;
        padding: 0;
        top: 0;
        z-index: 1;
        position: sticky;
        width: 100%;
        align-items: center;
      `}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapse(!collapsed)}
        css={css`
          font-size: 16px !important;
          width: 64px !important;
          height: 64px !important;
        `}
      />

      <div
        css={css`
          flex: 1;
        `}
      />

      <Space
        css={css`
          margin-right: ${token.margin}px;
        `}
      >
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={gTheme.algorithm.includes(theme.darkAlgorithm)}
          onChange={() => toggleTheme()}
        />

        <Dropdown
          trigger={['click']}
          menu={{ items: dropItems }}
          placement="bottomRight"
        >
          <Avatar
            css={css`
              cursor: pointer;
              border: 2px solid ${token.colorBorder};
            `}
            size={48}
            src={user?.avatarImageFileUrl}
          >
            {user?.firstName.charAt(0)}
          </Avatar>
        </Dropdown>
      </Space>
    </Layout.Header>
  );
};

export default MainTopBar;
