import {
  CheckOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Dropdown,
  Flex,
  Form,
  Input,
  Popover,
  Space,
  Table,
  message,
} from 'antd';
import modal from 'antd/es/modal';
import dayjs from 'dayjs';
import { useState } from 'react';

import useApp from '@/hooks/use-app';

import activityService from '../activity.service';
import ActivityFormDrawer from './activity-drawer-form';
import GradeDrawerForm from './grade-drawer-form';

interface ActivityTableProps {
  courseId: number;
  onGrade?: (activity: any) => void;
}

export default function ActivityTable({
  courseId,
  onGrade,
}: ActivityTableProps) {
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [formId, setFormId] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const [gradingActivity, setGradingActivity] = useState<any>(null);
  const [gradingDrawerOpen, setGradingDrawerOpen] = useState(false);

  const handleCloseGrading = () => {
    setGradingDrawerOpen(false);
    setGradingActivity(null);
  };

  const [form] = Form.useForm();

  const handleDeleteMutation = useMutation({
    mutationFn: (id: number) => activityService.deleteActivity(id),
    onSuccess: () => {
      message.success(t('Deleted successfully'));
      refetchActivities();
    },
  });

  const { t, token } = useApp();

  const { data: activities, refetch: refetchActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await activityService.getAllActivities({
        courseId,
        take: 100,
        skip: 0,
      });
      return response.data.items;
    },
    enabled: !!courseId,
  });

  return (
    <div>
      <Flex vertical gap={token.size}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setFormMode('create');
                form.resetFields();
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
        dataSource={activities || []}
        columns={[
          {
            title: t('Title'),
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: t('Description'),
            dataIndex: 'description',
            key: 'description',
            render: (_, record) =>
              record.description.length > 100
                ? record.description.slice(0, 100) + '...'
                : record.description,
          },
          {
            title: t('Type'),
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: t('Status'),
            dataIndex: 'status',
            key: 'status',
          },
          {
            title: t('Created at'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: string) =>
              dayjs(value).format('DD/MM/YYYY - HH:mm:ss'),
          },
          {
            title: t('Updated at'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: string) =>
              dayjs(value).format('DD/MM/YYYY - HH:mm:ss'),
          },
          {
            title: t('Actions'),
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: t('View'),
                      key: 'view',
                      icon: <EyeOutlined />,
                      onClick: () => {
                        setFormMode('update');
                        setFormId(record.id);
                        setOpenFormDrawer(true);
                      },
                    },
                    {
                      label: t('Chấm điểm'),
                      key: 'grade',
                      icon: <CheckOutlined />,
                      onClick: () => {
                        setGradingActivity(record);
                        setGradingDrawerOpen(true);
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
                            await handleDeleteMutation.mutateAsync(+record.id);
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
        css={css`
          background: ${token.colorBgContainer};
          border-radius: ${token.borderRadius}px;
          padding: ${token.padding}px;
        `}
      />
      <ActivityFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        refetch={refetchActivities}
        courseId={courseId}
        id={formId}
      />
      <GradeDrawerForm
        activityId={gradingActivity?.id}
        activityTitle={gradingActivity?.title}
        open={gradingDrawerOpen}
        onClose={handleCloseGrading}
      />
    </div>
  );
}
