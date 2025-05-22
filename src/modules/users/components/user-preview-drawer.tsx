import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Drawer, Empty, Image, Skeleton } from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';

import userService from '../user.service';
import UserRoleTag from './user-role-tag';

type TUserPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: number;
};

const UserPreviewDrawer: React.FC<TUserPreviewProps> = ({
  open,
  setOpen,
  id,
}: TUserPreviewProps) => {
  const { t, token } = useApp();

  const getUserQuery = useQuery({
    queryKey: ['/users/get-one', id],
    enabled: !!id,
    queryFn: () => (id ? userService.getUser(id) : undefined),
  });

  return (
    <Drawer
      title="Preview user"
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>}
    >
      {getUserQuery.isLoading ? (
        <Skeleton />
      ) : !getUserQuery?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={2}
          title="User Info"
          items={[
            {
              label: t('ID'),
              span: 2,
              children: getUserQuery?.data?.data?.id,
            },
            {
              label: t('First name'),
              span: 1,
              children: getUserQuery?.data?.data?.firstName,
            },
            {
              label: t('Last name'),
              span: 1,
              children: getUserQuery?.data?.data?.lastName,
            },
            {
              label: t('Gender'),
              span: 1,
              children: getUserQuery?.data?.data?.gender,
            },
            {
              label: t('Date of birth'),
              span: 1,
              children: getUserQuery?.data?.data?.dateOfBirth
                ? dayjs(getUserQuery?.data?.data?.dateOfBirth).format(
                    'YYYY/MM/DD',
                  )
                : '',
            },
            {
              label: t('Phone number'),
              span: 1,
              children: getUserQuery?.data?.data?.phoneNumber,
            },
            {
              label: t('Email'),
              span: 1,
              children: getUserQuery?.data?.data?.userLogin?.email,
            },
            {
              label: t('Roles'),
              span: 2,
              children: getUserQuery?.data?.data?.roles?.map((role) => (
                <UserRoleTag key={role} role={role} />
              )),
            },
            {
              label: t('Created at'),
              span: 2,
              children: dayjs(getUserQuery?.data?.data?.createdAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
            {
              label: t('Avatar'),
              span: 2,
              children: getUserQuery?.data?.data?.avatarImageFileUrl && (
                <Image
                  src={getUserQuery?.data?.data?.avatarImageFileUrl}
                  alt="avatar"
                  width={100}
                  css={css`
                    border-radius: ${token.borderRadius}px;
                  `}
                />
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default UserPreviewDrawer;
