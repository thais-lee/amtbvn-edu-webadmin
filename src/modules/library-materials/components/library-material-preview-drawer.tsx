import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Drawer, Empty, Image, Skeleton } from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';

import libraryMaterialService from '../library-materials.service';

type TLibraryMaterialPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: number;
};

const LibraryMaterialPreviewDrawer: React.FC<TLibraryMaterialPreviewProps> = ({
  open,
  setOpen,
  id,
}: TLibraryMaterialPreviewProps) => {
  const { t } = useApp();

  const getLibraryMaterialQuery = useQuery({
    queryKey: ['/library-materials/get-one', id],
    enabled: !!id,
    queryFn: () =>
      id ? libraryMaterialService.getLibraryMaterial(id) : undefined,
  });

  return (
    <Drawer
      title={t('Preview category')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>}
    >
      {getLibraryMaterialQuery.isLoading ? (
        <Skeleton />
      ) : !getLibraryMaterialQuery?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={2}
          title={t('Category Info')}
          items={[
            {
              label: t('ID'),
              span: 2,
              children: getLibraryMaterialQuery?.data?.id,
            },
            {
              label: t('Title'),
              span: 1,
              children: getLibraryMaterialQuery?.data?.title,
            },
            {
              label: t('Description'),
              span: 1,
              children: getLibraryMaterialQuery?.data?.description,
            },
            {
              label: t('Category'),
              span: 1,
              children: getLibraryMaterialQuery?.data?.category?.name,
            },
            {
              label: t('Created at'),
              span: 2,
              children: dayjs(getLibraryMaterialQuery?.data?.createdAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
            {
              label: t('Files'),
              span: 2,
              children: getLibraryMaterialQuery?.data?.files.map((file) => (
                <div key={file.id}>
                  <Image
                    src={file.storagePath}
                    alt={file.fileName}
                    width={100}
                  />
                </div>
              )),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default LibraryMaterialPreviewDrawer;
