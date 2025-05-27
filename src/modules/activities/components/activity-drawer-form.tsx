import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';

import activityService from '../activity.service';
import { TCreateActivityDto, TUpdateActivityDto } from '../dto/activity.dto';

interface ActivityFormDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => void;
}

const ActivityFormDrawer = ({
  open,
  setOpen,
  action,
  id,
  refetch,
}: ActivityFormDrawerProps) => {
  const { t, antdApp } = useApp();
  const { message } = antdApp;
  const [form] = Form.useForm<TCreateActivityDto | TUpdateActivityDto>();

  const { data: activity } = useQuery({
    queryKey: ['activities', id],
    queryFn: () => activityService.getOne(id!),
    enabled: !!id && action === 'update',
  });

  useEffect(() => {
    if (activity?.data) {
      form.setFieldsValue({
        title: activity.data.title,
        description: activity.data.description,
        type: activity.data.type,
        courseId: activity.data.courseId,
      });
    }
  }, [activity, form]);

  const handleSubmit = async (
    values: TCreateActivityDto | TUpdateActivityDto,
  ) => {
    try {
      if (action === 'create') {
        await activityService.createActivity(values as TCreateActivityDto);
        message.success(t('Created successfully'));
      } else {
        await activityService.updateActivity(id!, values as TUpdateActivityDto);
        message.success(t('Updated successfully'));
      }
      setOpen(false);
      form.resetFields();
      refetch?.();
    } catch (error) {
      message.error(t('An error occurred'));
    }
  };

  return (
    <Drawer
      title={
        action === 'create' ? t('Create new activity') : t('Update activity')
      }
      width={720}
      onClose={() => setOpen(false)}
      open={open}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
          <Button onClick={() => form.submit()} type="primary">
            {action === 'create' ? t('Create') : t('Update')}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label={t('Title')}
          rules={[{ required: true, message: t('Please enter title') }]}
        >
          <Input placeholder={t('Enter title')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('Description')}
          rules={[{ required: true, message: t('Please enter description') }]}
        >
          <Input.TextArea placeholder={t('Enter description')} />
        </Form.Item>

        <Form.Item
          name="type"
          label={t('Type')}
          rules={[{ required: true, message: t('Please select type') }]}
        >
          <Select
            placeholder={t('Select type')}
            options={[
              { label: 'Assignment', value: 'ASSIGNMENT' },
              { label: 'Quiz', value: 'QUIZ' },
              { label: 'Discussion', value: 'DISCUSSION' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('Status')}
          rules={[{ required: true, message: t('Please select status') }]}
        >
          <Select
            placeholder={t('Select status')}
            options={[
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Archived', value: 'ARCHIVED' },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ActivityFormDrawer;
