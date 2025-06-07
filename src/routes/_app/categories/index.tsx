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
  Skeleton,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/categories/category.service';
import CategoryFormDrawer from '@/modules/categories/components/category-form-drawer';
import CategoryPreviewDrawer from '@/modules/categories/components/category-preview-drawer';
import BreadcrumbComponent from '@/shared/components/breadcrumb';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/categories/')({
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

  const deleteManyCategories = useMutation({
    mutationFn: (ids: number[]) => categoryService.deleteManyCategories(ids),
    onSuccess: () => {
      categoryQuery.refetch();
      message.success(t('Deleted successfully'));
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error(t('An error occurred'));
      setSelectedRowKeys([]);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      categoryQuery.refetch();
      message.success(t('Deleted successfully'));
      setSelectedRowKeys([]);
    },
  });

  // Placeholder query for categories
  const categoryQuery = useQuery({
    queryKey: ['/categories/all', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      categoryService.getAllCategories({
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

  // Columns for main category table
  const columns = [
    {
      title: t('categoryName', { defaultValue: 'Category Name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('parentCategory', { defaultValue: 'Parent Category' }),
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: number) => parentId || '-',
    },
    {
      title: t('slug', { defaultValue: 'Slug' }),
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: t('subCategories', { defaultValue: 'Sub Categories count' }),
      dataIndex: '_count',
      key: '_count.subCategories',
      render: (_: any, record: any) => record._count?.subCategories ?? '-',
    },
    {
      title: t('actions', { defaultValue: 'Actions' }),
      key: 'actions',
      fixed: 'right',
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
                label: t('View sub categories'),
                key: 'view-sub-categories',
                icon: <EyeOutlined />,
                onClick: () => {
                  navigate({
                    to: '/categories/$parentId',
                    params: {
                      parentId: record.slug,
                    },
                  });
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
                      await deleteCategory.mutateAsync(+record.id);
                    },
                  });
                },
              },
            ],
          }}
        >
          <Button>
            <Space>
              {t('Actions')}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <Flex vertical>
      <CategoryFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        id={formId}
        refetch={categoryQuery.refetch}
      />
      <CategoryPreviewDrawer
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
                    await deleteManyCategories.mutateAsync(
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
          loading={categoryQuery.isLoading || categoryQuery.isFetching}
          columns={columns as any}
          dataSource={categoryQuery.data?.data.items}
          rowKey={(record) => record.id}
          pagination={{
            ...tableParams.pagination,
            total: categoryQuery.data?.data.total || 0,
            onChange: (page, pageSize) => {
              setTableParams({
                ...tableParams,
                pagination: { current: page, pageSize },
              });
            },
          }}
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
