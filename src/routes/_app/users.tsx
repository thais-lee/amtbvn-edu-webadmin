import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Avatar,
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
import dayjs from 'dayjs';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import UserFormDrawer from '@/modules/users/components/user-form-drawer';
import UserPreviewDrawer from '@/modules/users/components/user-preview-drawer';
import UserRoleTag from '@/modules/users/components/user-role-tag';
import UsersFilterForm from '@/modules/users/components/users-filter-form';
import { EUserRole } from '@/modules/users/user.model';
import userService from '@/modules/users/user.service';
import TitleHeading from '@/shared/components/title-heading';

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

export const Route = createFileRoute('/_app/users')({
  component: UsersPage,
});

function UsersPage() {
  const { t, antdApp, token } = useApp();

  useAppTitle(t('Users'));

  const { message, modal } = antdApp;

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      search: '',
      roles: [],
    },
  });
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [formId, setFormId] = useState<number | undefined>();
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState<string>('');

  useDebounce(
    () => {
      setTableParams({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          search: search,
        },
      });
    },
    1000,
    [search],
  );

  const getUsersQuery = useQuery({
    queryKey: [
      '/users/get-paginated',
      tableParams.pagination,
      tableParams.filters,
    ],
    queryFn: () =>
      userService.getPaginatedUsers({
        take: tableParams.pagination?.pageSize || 10,
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

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      getUsersQuery.refetch();
      message.success(t('Deleted successfully'));
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  const deleteManyUsersMutation = useMutation({
    mutationFn: (ids: number[]) => userService.deleteUsers(ids),
    onSuccess: () => {
      getUsersQuery.refetch();
      message.success(t('Deleted successfully'));
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  return (
    <>
      <UserFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        id={formId}
        refetch={getUsersQuery.refetch}
      />

      <UserPreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={selectedId}
      />

      <TitleHeading>{t('User management')}</TitleHeading>

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
                    await deleteManyUsersMutation.mutateAsync(
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
                content={
                  <UsersFilterForm
                    onSubmit={(values: any) => {
                      setTableParams({
                        ...tableParams,
                        filters: values,
                      });
                    }}
                  />
                }
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
          loading={getUsersQuery.isLoading || getUsersQuery.isFetching}
          dataSource={getUsersQuery.data?.data.items || []}
          pagination={tableParams.pagination}
          rowKey={(record) => record.id}
          bordered
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          columns={[
            {
              title: t('ID'),
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: t('User'),
              render: (_, record) => (
                <Space>
                  <Avatar shape="square" src={record.avatarImageFileUrl}>
                    {record.firstName[0]}
                    {record.lastName?.[0]}
                  </Avatar>
                  {`${record.firstName} ${record?.lastName || ''}`}
                </Space>
              ),
            },
            {
              title: t('Gender'),
              dataIndex: 'gender',
              key: 'gender',
            },
            {
              title: t('Date of birth'),
              dataIndex: 'dateOfBirth',
              key: 'dateOfBirth',
              render: (value: string) =>
                value ? dayjs(value).format('DD/MM/YYYY') : '',
            },
            {
              title: t('Phone number'),
              dataIndex: 'phoneNumber',
              key: 'phoneNumber',
            },
            {
              title: t('Roles'),
              dataIndex: 'roles',
              key: 'roles',
              render: (roles: EUserRole[]) => (
                <>
                  {roles.map((role) => (
                    <UserRoleTag key={role} role={role} />
                  ))}
                </>
              ),
            },
            {
              title: t('Created at'),
              dataIndex: 'createdAt',
              key: 'createdAt',
              render: (value: string) =>
                dayjs(value).format('DD/MM/YYYY - HH:mm:ss'),
            },
            {
              key: 'actions',
              fixed: 'right',
              width: 100,
              render: (_, record) => (
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
                            content: t(
                              'Are you sure you want to delete this item?',
                            ),
                            okText: t('Yes'),
                            cancelText: t('No'),
                            onOk: async () => {
                              await deleteUserMutation.mutateAsync(+record.id);
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
          ]}
          onChange={(pagination) => {
            setTableParams({
              ...tableParams,
              pagination,
            });
          }}
        />
      </Flex>
    </>
  );
}

export default UsersPage;
