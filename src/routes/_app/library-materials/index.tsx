import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Input,
  Popover,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import LibraryMaterialFormDrawer from '@/modules/library-materials/components/library-material-form-drawer';
import LibraryMaterialPreviewDrawer from '@/modules/library-materials/components/library-material-preview-drawer';
import libraryMaterialService from '@/modules/library-materials/library-materials.service';
import BreadcrumbComponent from '@/shared/components/breadcrumb';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/library-materials/')({
  component: RouteComponent,
});

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function RouteComponent() {
  const { t, token, antdApp } = useApp();
  const navigate = useNavigate();
  const { message, modal } = antdApp;

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      search: '',
      parentId: null,
    },
  });
  const [search, setSearch] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [formId, setFormId] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');

  useDebounce(
    () => {
      setTableParams({
        ...tableParams,
      });
    },
    1000,
    [search],
  );

  const deleteManyLibraryMaterials = useMutation({
    mutationFn: (ids: number[]) =>
      libraryMaterialService.deleteManyLibraryMaterials(ids),
    onSuccess: () => {
      libraryMaterialsQuery.refetch();
      message.success(t('Deleted successfully'));
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error(t('An error occurred'));
      setSelectedRowKeys([]);
    },
  });

  const deleteLibraryMaterial = useMutation({
    mutationFn: (id: number) =>
      libraryMaterialService.deleteLibraryMaterial(id),
    onSuccess: () => {
      libraryMaterialsQuery.refetch();
      message.success(t('Deleted successfully'));
      setSelectedRowKeys([]);
    },
  });

  const libraryMaterialsQuery = useQuery({
    queryKey: [
      '/library-materials/all',
      tableParams.pagination,
      tableParams.filters,
    ],
    queryFn: () =>
      libraryMaterialService.getLibraryMaterials({
        take: tableParams.pagination.pageSize || 10,
        skip:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
        sort: tableParams.sortField,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
      }),
  });

  const columns = [
    {
      title: t('libraryMaterialTitle', {
        defaultValue: 'Library Material Title',
      }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('category', { defaultValue: 'Category' }),
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => category?.name || '-',
    },
    {
      title: t('actions', { defaultValue: 'Actions' }),
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                label: t('View'),
                key: 'view',
                icon: <EyeOutlined />,
                onClick: () => {
                  setSelectedId(record.id);
                  setOpenPreviewDrawer(true);
                },
              },
              {
                label: t('Edit'),
                key: 'edit',
                icon: <EditOutlined />,
                onClick: () => {
                  setFormMode('update');
                  setFormId(record.id);
                  setOpenFormDrawer(true);
                },
              },
              {
                label: t('Delete'),
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                  modal.confirm({
                    title: t('Delete confirmation'),
                    content: t('Are you sure you want to delete this item?'),
                    okText: t('Yes'),
                    cancelText: t('No'),
                    onOk: async () => {
                      await deleteLibraryMaterial.mutateAsync(+record.id);
                    },
                  });
                },
              },
            ],
          }}
        >
          <Button type="text" icon={<DownOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Flex vertical>
      <LibraryMaterialFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        id={formId}
        refetch={libraryMaterialsQuery.refetch}
      />
      <LibraryMaterialPreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={selectedId}
      />
      <BreadcrumbComponent
        items={[
          {
            title: t('Categories', { defaultValue: 'Categories' }),
            path: '/categories',
          },
        ]}
      />
      <TitleHeading>
        {t('manageCategories', { defaultValue: 'Manage Categories' })}
      </TitleHeading>
      <Divider />
      <Flex vertical gap={token.size}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setFormMode('create');
                setOpenFormDrawer(true);
              }}
            >
              {t('Create')}
            </Button>

            <Button
              danger
              type="dashed"
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                modal.confirm({
                  title: t('Delete confirmation'),
                  content: t(
                    'Are you sure you want to delete the selected items?',
                  ),
                  okText: t('Yes'),
                  cancelText: t('No'),
                  onOk: async () => {
                    await deleteManyLibraryMaterials.mutateAsync(
                      selectedRowKeys.map((key) => +key.toString()),
                    );
                  },
                });
              }}
            >
              {t('Delete selected')}
            </Button>
          </Space>

          <div>
            <Space direction="horizontal" style={{ width: '100%' }}>
              <Popover
                placement="bottomRight"
                trigger="click"
                title={t('Filter')}
                content={<></>}
              >
                <Button icon={<FilterOutlined />}>{t('Filter')}</Button>
              </Popover>

              <Input.Search
                placeholder={t('Search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Space>
          </div>
        </Flex>

        <Table
          loading={
            libraryMaterialsQuery.isLoading || libraryMaterialsQuery.isFetching
          }
          columns={columns as any}
          dataSource={libraryMaterialsQuery.data?.data.items || []}
          rowKey={(record) => record.id}
          pagination={tableParams.pagination}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          css={css`
            background: ${token.colorBgContainer};
            border-radius: ${token.borderRadius}px;
            padding: ${token.padding}px;
          `}
        />
      </Flex>
    </Flex>
  );
}
