import { FilterOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import courseService from '@/modules/courses/course.service';
import userService from '@/modules/users/user.service';

import {
  EEnrollmentStatus,
  TCreateEnrollmentDto,
  TUpdateEnrollmentDto,
} from '../dto/enrollment.dto';
import { TEnrollment } from '../enrollment.model';
import enrollmentService from '../enrollment.service';
import { EnrollmentStatusTag } from './enrollment-status-tag';

interface EnrollmentListProps {
  courseId: number;
}

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

export const EnrollmentList: React.FC<EnrollmentListProps> = ({
  courseId,
}: EnrollmentListProps) => {
  const { t, token, antdApp, isDarkTheme } = useApp();
  const [loading] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { message, modal } = antdApp;
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formId, setFormId] = useState<{ userId: number; courseId: number }>({
    userId: 0,
    courseId: courseId,
  });
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [userSearch, setUserSearch] = useState<string>('');
  const [debouncedUserSearch, setDebouncedUserSearch] = useState('');

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

  const { data: enrollments, refetch } = useQuery({
    queryKey: [
      '/courses/member',
      tableParams.pagination,
      tableParams.filters,
      courseId,
    ],
    queryFn: () =>
      courseService.getCourseEnrollments({
        take: tableParams.pagination.pageSize || 10,
        skip:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
        sort: tableParams.sortField,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
        courseId,
      }),
  });

  const { data: userSearchResult, isFetching } = useQuery({
    queryKey: ['user-search', debouncedUserSearch],
    queryFn: () => userService.searchUsers({ search: debouncedUserSearch }),
    enabled: !!debouncedUserSearch,
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  const handleDeleteMutation = useMutation({
    mutationFn: (userId: number) =>
      enrollmentService.deleteEnrollment({
        userId,
        courseId,
      }),
    onSuccess: () => {
      message.success(t('Deleted successfully'));
      refetch();
    },
  });

  const handleUpdateMutation = useMutation({
    mutationFn: (data: TUpdateEnrollmentDto) =>
      enrollmentService.updateEnrollment(formId, data),
    onSuccess: () => {
      message.success(t('Updated successfully'));
      setOpenFormDrawer(false);
      form.resetFields();
      refetch();
    },
  });

  const handleCreateMutation = useMutation({
    mutationFn: (data: TCreateEnrollmentDto) =>
      enrollmentService.adminCreateEnrollment(data),
    onSuccess: () => {
      message.success(t('Created successfully'));
      setOpenFormDrawer(false);
      form.resetFields();
      refetch();
    },
  });

  const columns = [
    {
      title: t('User'),
      key: 'userId',
      render: (_: any, record: TEnrollment) => (
        <Space>
          <Avatar src={record.user.avatarImageFileUrl} />
          <Typography.Text>
            {record.user.lastName} {record.user.firstName}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: t('Status'),
      key: 'status',
      render: (_: any, record: TEnrollment) => (
        <EnrollmentStatusTag status={record.status} />
      ),
    },
    {
      title: t('Enrolled At'),
      key: 'createdAt',
      render: (_: any, record: TEnrollment) => (
        <Typography.Text>
          {dayjs(record.enrolledAt).format('HH:mm DD/MM/YYYY')}
        </Typography.Text>
      ),
    },
    {
      title: t('Completed At'),
      key: 'completedAt',
      render: (_: any, record: TEnrollment) => (
        <Typography.Text>
          {record.completedAt
            ? dayjs(record.completedAt).format('HH:mm DD/MM/YYYY')
            : '-'}
        </Typography.Text>
      ),
    },
    {
      title: t('Last Accessed At'),
      key: 'lastAccessedAt',
      render: (_: any, record: TEnrollment) => (
        <Typography.Text>
          {record.lastAccessedAt
            ? dayjs(record.lastAccessedAt).format('HH:mm DD/MM/YYYY')
            : '-'}
        </Typography.Text>
      ),
    },
    {
      title: t('Progress'),
      key: 'progressPercentage',
      render: (_: any, record: TEnrollment) => (
        <Typography.Text>{record.progressPercentage}%</Typography.Text>
      ),
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_: any, record: TEnrollment) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setFormMode('update');
              setFormId({
                userId: record.userId,
                courseId: record.courseId,
              });
              form.setFieldsValue({
                userId: record.userId,
                courseId: record.courseId,
                status: record.status,
              });
              setOpenFormDrawer(true);
            }}
          >
            {t('Edit')}
          </Button>
          <Button
            danger
            onClick={() => {
              modal.confirm({
                title: t('Delete confirmation'),
                content: t('Are you sure you want to delete this item?'),
                okText: t('Yes'),
                cancelText: t('No'),
                onOk: async () => {
                  await handleDeleteMutation.mutateAsync(record.userId);
                },
              });
            }}
          >
            {t('Delete')}
          </Button>
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    if (formMode === 'update') {
      handleUpdateMutation.mutate(values);
    } else {
      handleCreateMutation.mutate(values);
    }
    setOpenFormDrawer(false);
    form.resetFields();
  };

  const userOptions =
    userSearchResult?.data?.items?.map((user: any) => ({
      label: `${user.userLogin?.email || ''} (${
        user.userLogin?.username || ''
      })`,
      value: user.id,
    })) || [];

  useDebounce(
    () => {
      setDebouncedUserSearch(userSearch);
    },
    500, // debounce delay in ms
    [userSearch],
  );

  return (
    <div>
      <Flex vertical gap={token.size}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setFormMode('create');
                setOpenFormDrawer(true);
                form.resetFields();
                form.setFieldsValue({
                  userId: null,
                  courseId: courseId,
                  status: EEnrollmentStatus.PENDING,
                });
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
                    handleDeleteMutation.mutate(selectedRowKeys[0] as number);
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
      </Flex>

      <Table
        columns={columns}
        dataSource={enrollments?.data?.items || []}
        loading={loading}
        rowKey={(record) => {
          return `${record.userId}-${record.courseId}`;
        }}
        pagination={tableParams.pagination}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        css={css`
          background: ${isDarkTheme
            ? token.colorBgContainer
            : token.colorBgElevated};
          border-radius: ${token.borderRadius}px;
          padding: ${token.padding}px;
        `}
      />

      <Modal
        title={t('Create Enrollment')}
        open={openFormDrawer}
        onCancel={() => setOpenFormDrawer(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {formMode === 'create' && (
            <>
              <Form.Item
                name="userId"
                label={t('User')}
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  placeholder="Search user"
                  filterOption={false}
                  onSearch={setUserSearch}
                  notFoundContent={
                    isFetching ? <span>{t('Loading')}...</span> : null
                  }
                  options={userOptions}
                />
              </Form.Item>
              <Form.Item
                name="courseId"
                label={t('Courses')}
                rules={[{ required: true }]}
              >
                <Input type="number" disabled />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="status"
            label={t('Status')}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={EEnrollmentStatus.PENDING}>
                {t('Pending')}
              </Select.Option>
              <Select.Option value={EEnrollmentStatus.ACCEPTED}>
                {t('Accepted')}
              </Select.Option>
              <Select.Option value={EEnrollmentStatus.REJECTED}>
                {t('Rejected')}
              </Select.Option>
              <Select.Option value={EEnrollmentStatus.CANCELLED}>
                {t('Cancel')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Flex justify="end">
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {t('Submit')}
            </Button>
            <Button onClick={() => setOpenFormDrawer(false)} danger>
              {t('Cancel')}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </div>
  );
};
