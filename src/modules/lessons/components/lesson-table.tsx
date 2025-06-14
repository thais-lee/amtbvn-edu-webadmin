import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import DayFormat from '@/shared/components/day-format';
import { EDateFormatType } from '@/shared/components/day-format';

import { ELessonStatus } from '../dto/lesson.dto';
import { TLesson } from '../lesson.model';
import lessonService from '../lesson.service';
import LessonFormDrawer from './lesson-drawer-form';

interface LessonTableProps {
  courseId?: number;
}

export default function LessonTable({ courseId }: LessonTableProps) {
  const [open, setOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [drawerItem, setDrawerItem] = useState<TLesson | null>(null);
  const { t } = useApp();

  const { data: lessons, refetch: refetchLessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () =>
      lessonService.getAllLessons({
        courseId,
      }),
  });

  const sortedLessons = lessons?.data
    ? [...lessons.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];
  const latestLessonId =
    sortedLessons.length > 0 ? sortedLessons[0].id : undefined;

  useEffect(() => {
    if (refetch) {
      setRefetch(false);
      refetchLessons();
    }
  }, [refetch, refetchLessons]);

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => {
          setOpen(true);
          setDrawerMode('create');
          setDrawerItem(null);
        }}
      >
        {t('Create')}
      </Button>
      <Table
        dataSource={sortedLessons}
        columns={[
          {
            title: t('Title'),
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: t('Content'),
            dataIndex: 'content',
            key: 'content',
            render: (_, record) =>
              //short content
              record.content.length > 100
                ? record.content.slice(0, 100) + '...'
                : record.content,
          },
          {
            title: t('Status'),
            key: 'status',
            align: 'center',
            render: (_, record) => (
              <Tag
                color={
                  record.status === ELessonStatus.PUBLISHED ? 'green' : 'blue'
                }
                style={{ textAlign: 'center', width: '100%' }}
              >
                {record.status}
              </Tag>
            ),
          },
          {
            title: t('Is important'),
            key: 'isImportant',
            align: 'center',
            render: (_, record) =>
              record.isImportant ? (
                <CheckOutlined style={{ color: 'green', fontSize: 20 }} />
              ) : (
                <CloseOutlined style={{ color: 'red', fontSize: 20 }} />
              ),
          },
          {
            title: t('Created at'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, record) => (
              <DayFormat
                date={record.createdAt}
                format={EDateFormatType.HH_MM_DD_MM_YYYY}
              />
            ),
          },
          {
            title: t('Updated at'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (_, record) => (
              <DayFormat
                date={record.updatedAt}
                format={EDateFormatType.HH_MM_DD_MM_YYYY}
              />
            ),
          },
          {
            title: t('Actions'),
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setOpen(true);
                    setDrawerMode('edit');
                    setDrawerItem(record);
                  }}
                >
                  {t('Edit')}
                </Button>
              </Space>
            ),
          },
        ]}
      />
      <LessonFormDrawer
        open={open}
        setOpen={setOpen}
        action={drawerMode}
        item={drawerItem}
        refetch={() => setRefetch(!refetch)}
        courseId={courseId}
        latestLessonId={latestLessonId}
      />
    </div>
  );
}
