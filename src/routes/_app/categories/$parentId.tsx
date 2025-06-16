import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { Button, Divider, Dropdown, Flex, Skeleton, Space, Table } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/categories/category.service';
import CategoryFormDrawer from '@/modules/categories/components/category-form-drawer';
import CategoryPreviewDrawer from '@/modules/categories/components/category-preview-drawer';
import BreadcrumbComponent from '@/shared/components/breadcrumb';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/categories/$parentId')({
  component: SubCategoriesView,
});

function SubCategoriesView() {
  const { t, token, isDarkTheme, antdApp } = useApp();
  const { modal } = antdApp;
  const navigate = useNavigate();
  const { parentId: parentSlug } = useParams({
    from: '/_app/categories/$parentId',
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [formId, setFormId] = useState<number>(0);
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);

  // Get current category data by slug
  const {
    data: currentCategory,
    isLoading: isLoadingCurrent,
    refetch: refetchCurrentCategory,
  } = useQuery({
    queryKey: ['/categories/sub', { parentSlug }],
    queryFn: () =>
      categoryService.getSubCategories({
        take: pagination.pageSize,
        skip: (pagination.current - 1) * pagination.pageSize,
        slug: parentSlug,
      }),
  });

  // Get category path for breadcrumb
  const { data: categoryPath } = useQuery({
    queryKey: ['/categories/path', parentSlug],
    queryFn: () => categoryService.getCategoryPath(parentSlug),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      refetchCurrentCategory();
      setSelectedRowKeys([]);
    },
  });

  const deleteManyCategoriesMutation = useMutation({
    mutationFn: (ids: number[]) => categoryService.deleteManyCategories(ids),
    onSuccess: () => {
      refetchCurrentCategory();
      setSelectedRowKeys([]);
    },
  });
  const columns = [
    {
      title: t('categoryName', { defaultValue: 'Category Name' }),
      dataIndex: 'name',
      key: 'name',
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

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      title: t('Categories', { defaultValue: 'Categories' }),
      path: '/categories',
    },
    ...(categoryPath?.data || []).map((category) => ({
      title: category.name,
      path: `/categories/${category.slug}`,
    })),
  ];

  return (
    <>
      <CategoryFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        id={formId}
        refetch={refetchCurrentCategory}
        parentCategoriesId={currentCategory?.data?.id}
      />
      <CategoryPreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={selectedId}
      />
      <BreadcrumbComponent items={breadcrumbItems} />
      <TitleHeading>
        {currentCategory?.data?.name ||
          t('Subcategories', { defaultValue: 'Subcategories' })}
      </TitleHeading>
      <Divider />
      <Flex vertical gap={token.size}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setOpenFormDrawer(true);
                setFormMode('create');
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
                    await deleteManyCategoriesMutation.mutateAsync(
                      selectedRowKeys.map((key) => +key.toString()),
                    );
                  },
                });
              }}
            >
              {t('Delete selected')}
            </Button>
          </Space>
        </Flex>
        {isLoadingCurrent ? (
          <Skeleton active />
        ) : (
          <Table
            columns={columns as any}
            dataSource={currentCategory?.data?.subCategories}
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: currentCategory?.data?.subCategories.length || 0,
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize }),
            }}
            css={{
              background: isDarkTheme
                ? token.colorBgContainer
                : token.colorBgElevated,
              borderRadius: token.borderRadius,
              padding: token.padding,
            }}
          />
        )}
      </Flex>
    </>
  );
}
