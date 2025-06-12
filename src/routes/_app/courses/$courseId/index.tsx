import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Avatar, Button, Drawer, Space, Table, Tabs, Typography } from 'antd';
import React from 'react';

import useApp from '@/hooks/use-app';
import ActivityTable from '@/modules/activities/components/activity-table';
import courseService from '@/modules/courses/course.service';
import { EnrollmentList } from '@/modules/enrollments/components/enrollment-list';
import LessonTable from '@/modules/lessons/components/lesson-table';

const { Title } = Typography;

const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  border-radius: 12px;
`;

const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BackButton = styled(Button)`
  position: absolute !important;
  top: 16px;
  left: 16px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9) !important;
  color: #1677ff !important;
  border: 1px solid #1677ff !important;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const CourseInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: -20px;
  margin-left: 32px;
  position: relative;
  z-index: 2;
`;

const CourseTitle = styled(Title)`
  margin: 0 !important;
  color: #222;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.7);
`;

export const Route = createFileRoute('/_app/courses/$courseId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getCourseBySlug(courseId),
  });
  const navigate = useNavigate();
  const { t } = useApp();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<'edit' | 'preview'>(
    'preview',
  );
  const [drawerType, setDrawerType] = React.useState<
    'lesson' | 'activity' | 'enrollment' | 'attachment' | null
  >(null);
  const [drawerItem, setDrawerItem] = React.useState<any>(null);

  // Handlers
  const openDrawer = (
    type: typeof drawerType,
    item: any,
    mode: typeof drawerMode,
  ) => {
    setDrawerType(type);
    setDrawerItem(item);
    setDrawerMode(mode);
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const attachmentColumns = [
    {
      title: 'ID',
      dataIndex: 'libraryMaterialId',
      key: 'libraryMaterialId',
      width: 80,
    },
    { title: 'Ghi chú', dataIndex: 'contextualNote', key: 'contextualNote' },
    {
      title: 'Hiển thị',
      dataIndex: 'isVisible',
      key: 'isVisible',
      render: (v: boolean) => (v ? 'Có' : 'Không'),
    },
    {
      title: 'Ngày thêm',
      dataIndex: 'addedAt',
      key: 'addedAt',
      render: (v: string) => v && new Date(v).toLocaleString(),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            onClick={() => openDrawer('attachment', record, 'preview')}
          >
            Xem
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => openDrawer('attachment', record, 'edit')}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  // Drawer content placeholder
  const renderDrawerContent = () => {
    if (!drawerItem || !drawerType) return null;
    if (drawerMode === 'preview') {
      return (
        <div>
          <Typography.Title level={4}>Xem {drawerType}</Typography.Title>
          <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 8 }}>
            {JSON.stringify(drawerItem, null, 2)}
          </pre>
        </div>
      );
    }
    // Edit mode placeholder
    return (
      <div>
        <Typography.Title level={4}>Sửa {drawerType}</Typography.Title>
        <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 8 }}>
          {JSON.stringify(drawerItem, null, 2)}
        </pre>
        <Button type="primary" style={{ marginTop: 16 }} disabled>
          Lưu (Demo)
        </Button>
      </div>
    );
  };

  return (
    <div>
      <BannerContainer>
        <BackButton
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate({ to: '/courses' })}
        >
          Go back
        </BackButton>
        <BannerImg src={course?.data?.bannerFileUrl} alt={course?.data?.name} />
      </BannerContainer>
      <CourseInfo>
        <Avatar
          src={course?.data?.imageFileUrl}
          alt={course?.data?.name}
          size={100}
          style={{
            border: '4px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
        <div
          style={{ display: 'flex', flexDirection: 'column', paddingTop: 16 }}
        >
          <CourseTitle level={3}>{course?.data?.name}</CourseTitle>
          <div style={{ color: '#666' }}>{'329 học viên đã đăng ký'}</div>
        </div>
      </CourseInfo>
      <Tabs
        defaultActiveKey="overview"
        style={{ marginTop: 32 }}
        items={[
          {
            key: 'overview',
            label: 'Tổng quan',
            children: (
              <div
                dangerouslySetInnerHTML={{
                  __html: course?.data?.description ?? '',
                }}
              />
            ),
          },
          {
            key: 'lessons',
            label: 'Bài học',
            children: (
              <>
                <LessonTable courseId={course?.data?.id || undefined} />
              </>
            ),
          },
          {
            key: 'activities',
            label: 'Hoạt động',
            children: (
              <>
                <ActivityTable courseId={course?.data?.id ?? 0} />
              </>
            ),
          },
          {
            key: 'enrollments',
            label: 'Học viên',
            children: (
              <>
                <EnrollmentList courseId={course?.data?.id || 0} />
              </>
            ),
          },
          {
            key: 'attachments',
            label: 'Tài liệu',
            children: (
              <>
                <Button
                  type="primary"
                  style={{ marginBottom: 16 }}
                  onClick={() => {
                    setDrawerType('attachment');
                    setDrawerMode('edit');
                    setDrawerItem(null);
                    setDrawerOpen(true);
                  }}
                >
                  Tạo mới
                </Button>
                <Table
                  rowKey="id"
                  columns={attachmentColumns}
                  dataSource={course?.data?.attachments || []}
                  pagination={false}
                />
              </>
            ),
          },
        ]}
      />
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        width={480}
        title={drawerMode === 'edit' ? 'Chỉnh sửa' : 'Xem chi tiết'}
        destroyOnHidden={true}
      >
        {renderDrawerContent()}
      </Drawer>
    </div>
  );
}
