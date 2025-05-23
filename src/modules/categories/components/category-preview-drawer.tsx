import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Drawer, Empty, Image, Skeleton } from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';

import categoryService from '../category.service';

type TCategoryPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: number;
};

const CategoryPreviewDrawer: React.FC<TCategoryPreviewProps> = ({
  open,
  setOpen,
  id,
}: TCategoryPreviewProps) => {
  const { t, token } = useApp();

  const getCategoryQuery = useQuery({
    queryKey: ['/categories/get-one', id],
    enabled: !!id,
    queryFn: () => (id ? categoryService.getOne(id) : undefined),
  });

  return (
    <Drawer
      title={t('Preview category')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>}
    >
      {getCategoryQuery.isLoading ? (
        <Skeleton />
      ) : !getCategoryQuery?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={2}
          title={t('Category Info')}
          items={[
            {
              label: t('ID'),
              span: 2,
              children: getCategoryQuery?.data?.data?.id,
            },
            {
              label: t('Name'),
              span: 1,
              children: getCategoryQuery?.data?.data?.name,
            },
            {
              label: t('Slug'),
              span: 1,
              children: getCategoryQuery?.data?.data?.slug,
            },
            {
              label: t('Parent category'),
              span: 1,
              children: getCategoryQuery?.data?.data?.parentId,
            },
            {
              label: t('Created at'),
              span: 2,
              children: dayjs(getCategoryQuery?.data?.data?.createdAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
            {
              label: t('Avatar'),
              span: 2,
              children: getCategoryQuery?.data?.data?.imageUrl && (
                <Image
                  src={getCategoryQuery?.data?.data?.imageUrl}
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

export default CategoryPreviewDrawer;
