import { useQuery } from '@tanstack/react-query';
import { Button, Space, Table } from 'antd';
import { useEffect, useState } from 'react';

import activityService from '../activity.service';
import ActivityFormDrawer from './activity-drawer-form';

interface ActivityTableProps {
  courseId?: number;
}

export default function ActivityTable({ courseId }: ActivityTableProps) {
  const [open, setOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const { data: activities } = useQuery({
    queryKey: ['activities'],
    queryFn: () =>
      activityService.getAllActivities({
        courseId,
        take: 100,
        skip: 0,
      }),
  });

  useEffect(() => {
    if (refetch) {
      setRefetch(false);
    }
  }, [refetch]);

  return (
    <div>
      <Table
        dataSource={activities?.data || []}
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) =>
              record.description.length > 100
                ? record.description.slice(0, 100) + '...'
                : record.description,
          },
          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
          },
          {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
          },
          {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
              <Space>
                <Button type="primary" onClick={() => setOpen(true)}>
                  Edit
                </Button>
              </Space>
            ),
          },
        ]}
      />
      <ActivityFormDrawer
        open={open}
        setOpen={setOpen}
        action="create"
        refetch={() => setRefetch(!refetch)}
      />
    </div>
  );
}
