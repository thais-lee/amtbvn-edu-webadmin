import { useQuery } from '@tanstack/react-query';
import { Button, Space, Table } from 'antd';
import { useState } from 'react';

import lessonService from '../lesson.service';
import LessonFormDrawer from './lesson-drawer-form';

interface LessonTableProps {
  courseId?: number;
}

export default function LessonTable({ courseId }: LessonTableProps) {
  const [open, setOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () =>
      lessonService.getAllLessons({
        courseId,
      }),
  });

  return (
    <div>
      <Table
        dataSource={lessons?.data || []}
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (_, record) =>
              //short content
              record.content.length > 100
                ? record.content.slice(0, 100) + '...'
                : record.content,
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
      <LessonFormDrawer
        open={open}
        setOpen={setOpen}
        action="create"
        refetch={() => setRefetch(!refetch)}
      />
    </div>
  );
}
