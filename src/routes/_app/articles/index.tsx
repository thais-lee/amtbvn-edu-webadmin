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
  Avatar,
  Button,
  Divider,
  Dropdown,
  Flex,
  Image,
  Input,
  Popover,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
} from 'antd';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { TArticle } from '@/modules/articles/article.model';
import articleService from '@/modules/articles/article.service';
import ArticleFormDrawer from '@/modules/articles/components/article-form-drawer';
import ArticlePreviewDrawer from '@/modules/articles/components/article-preview-drawer';
import BreadcrumbComponent from '@/shared/components/breadcrumb';
import TitleHeading from '@/shared/components/title-heading';
import { ArticleStatus, ArticlesType } from '@/shared/types/article.type';

export const Route = createFileRoute('/_app/articles/')({
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
      categoryId: null,
      type: null,
      status: null,
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
        filters: {
          ...tableParams.filters,
          search,
        },
      });
    },
    1000,
    [search],
  );

  const deleteArticle = useMutation({
    mutationFn: (id: number) => articleService.deleteArticle(id),
    onSuccess: () => {
      articleQuery.refetch();
      message.success(t('Deleted successfully'));
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error(t('An error occurred'));
      setSelectedRowKeys([]);
    },
  });

  const deleteManyArticles = useMutation({
    mutationFn: (ids: number[]) => articleService.deleteManyArticles(ids),
    onSuccess: () => {
      articleQuery.refetch();
      message.success(t('Deleted successfully'));
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error(t('An error occurred'));
      setSelectedRowKeys([]);
    },
  });

  const articleQuery = useQuery({
    queryKey: ['/articles/all', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      articleService.getAllArticles({
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
      title: t('Title'),
      dataIndex: 'title',
      key: 'title',
      // render: (_: any, record: TArticle) => (
      //   <Space>
      //     <img src={record.thumbnailUrl} width={50} alt={record.title} />
      //     {`${record.title}`}
      //   </Space>
      // ),
    },
    {
      title: t('Thumbnail'),
      dataIndex: 'thumbnailUrl',
      key: 'thumbnailUrl',
      render: (thumbnailUrl: string) => (
        <Image
          src={thumbnailUrl || 'assets/images/bill-bg.jpeg'}
          width={100}
          alt="Thumbnail"
          preview={false}
          style={{
            objectFit: 'cover',
          }}
        />
      ),
    },
    {
      title: t('Category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => category?.name || '-',
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: ArticlesType) => (
        <Tag color={type === ArticlesType.BULLETIN ? 'blue' : 'green'}>
          {type}
        </Tag>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: ArticleStatus) => (
        <Tag color={status === ArticleStatus.PUBLISHED ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: t('Views'),
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: t('Likes'),
      dataIndex: 'likeCount',
      key: 'likeCount',
    },
    {
      title: t('Actions'),
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
                      await deleteArticle.mutateAsync(+record.id);
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
      <ArticleFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        id={formId}
        refetch={articleQuery.refetch}
      />
      <ArticlePreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={selectedId}
      />
      <BreadcrumbComponent
        items={[
          {
            title: t('Articles'),
            path: '/articles',
          },
        ]}
      />
      <TitleHeading>{t('Manage Articles')}</TitleHeading>
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
                    await deleteManyArticles.mutateAsync(
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
          loading={articleQuery.isLoading || articleQuery.isFetching}
          columns={columns as any}
          dataSource={articleQuery.data?.data.items}
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
