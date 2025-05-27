import { DownOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Dropdown,
  Menu,
  Popconfirm,
  Space,
  Table,
  TablePaginationConfig,
  message,
} from 'antd';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/categories/category.service';
import CourseFormDrawer from '@/modules/courses/components/course-form-drawer';
import {
  TCourse,
  TCourseCreate,
  TCourseQuery,
  TCourseUpdate,
} from '@/modules/courses/course.model';
import courseService from '@/modules/courses/course.service';

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

export const Route = createFileRoute('/_app/courses/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { t } = useApp();
  const [editingCourse, setEditingCourse] = useState<
    Partial<TCourse> | undefined
  >(undefined);
  const navigate = useNavigate();
  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      search: '',
      status: undefined,
      categoryId: undefined,
    },
  });
  const [search, setSearch] = useState<string>('');

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

  const courseQuery = useQuery({
    queryKey: [
      '/courses/admin/all',
      tableParams.pagination,
      tableParams.filters,
    ],
    queryFn: () =>
      courseService.getAllCourses({
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

  const createMutation = useMutation({
    mutationFn: (values: TCourseCreate) => courseService.createCourse(values),
    onSuccess: () => {
      message.success('Created!');
      setOpenDrawer(false);
      courseQuery.refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...values }: { id: number } & TCourseUpdate) =>
      courseService.updateCourse(id, values),
    onSuccess: () => {
      message.success('Updated!');
      setOpenDrawer(false);
      courseQuery.refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.deleteCourse(id),
    onSuccess: () => {
      message.success('Deleted!');
      courseQuery.refetch();
    },
  });

  const handleEdit = (course: TCourse) => {
    setEditingCourse(course);
    setOpenDrawer(true);
  };

  const handleCreate = () => {
    setEditingCourse(undefined);
    setOpenDrawer(true);
  };

  const handleSubmit = (values: TCourseCreate | TCourseUpdate) => {
    if (editingCourse?.id) {
      updateMutation.mutate({ id: editingCourse.id, ...values });
    } else {
      createMutation.mutate(values as TCourseCreate);
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: any,
  ) => {
    setTableParams({
      pagination,
      filters,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleCreate}>
          Create Course
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={courseQuery.isLoading}
        dataSource={courseQuery.data?.data || []}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description' },
          { title: 'Category ID', dataIndex: 'categoryId' },
          { title: 'Status', dataIndex: 'status' },
          { title: 'Created At', dataIndex: 'createdAt' },
          {
            title: 'Actions',
            render: (_, record: TCourse) => (
              <Space>
                {/* <Button onClick={() => handleEdit(record)}>Edit</Button>
                <Popconfirm
                  title="Delete?"
                  onConfirm={() => deleteMutation.mutate(record.id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm> */}
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'view details',
                        label: 'View Details',
                        onClick: () =>
                          navigate({
                            to: '/courses/$courseId',
                            params: {
                              courseId: record.slug || '',
                            },
                          }),
                      },
                      {
                        key: 'edit',
                        label: 'Edit',
                        onClick: () => handleEdit(record),
                      },
                      {
                        key: 'delete',
                        label: 'Delete',
                        onClick: () => deleteMutation.mutate(record.id),
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
              </Space>
            ),
          },
        ]}
      />
      <CourseFormDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        onSubmit={handleSubmit}
        initialValues={editingCourse}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

export default RouteComponent;
