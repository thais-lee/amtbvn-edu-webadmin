import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';

import {
  TCreateEnrollmentDto,
  TUpdateEnrollmentDto,
} from '../dto/enrollment.dto';
import enrollmentService from '../enrollment.service';

interface EnrollmentFormDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => void;
}

const EnrollmentFormDrawer = ({
  open,
  setOpen,
  action,
  id,
  refetch,
}: EnrollmentFormDrawerProps) => {
  const { t, antdApp } = useApp();
  const { message } = antdApp;
  const [form] = Form.useForm<TCreateEnrollmentDto | TUpdateEnrollmentDto>();

  const { data: enrollment } = useQuery({
    queryKey: ['enrollments', id],
    queryFn: () => enrollmentService.getOne(id!),
    enabled: !!id && action === 'update',
  });

  useEffect(() => {
    if (enrollment?.data) {
      form.setFieldsValue({
        courseId: enrollment.data.courseId,
        userId: enrollment.data.userId,
        status: enrollment.data.status,
      });
    }
  }, [enrollment, form]);

  const handleSubmit = async (
    values: TCreateEnrollmentDto | TUpdateEnrollmentDto,
  ) => {
    try {
      if (action === 'create') {
        await enrollmentService.createEnrollment(
          values as TCreateEnrollmentDto,
        );
        message.success(t('Created successfully'));
      } else {
        await enrollmentService.updateEnrollment(
          id!,
          values as TUpdateEnrollmentDto,
        );
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
        action === 'create'
          ? t('Create new enrollment')
          : t('Update enrollment')
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
          name="courseId"
          label={t('Course ID')}
          rules={[{ required: true, message: t('Please enter course ID') }]}
        >
          <Input type="number" placeholder={t('Enter course ID')} />
        </Form.Item>

        <Form.Item
          name="userId"
          label={t('User ID')}
          rules={[{ required: true, message: t('Please enter user ID') }]}
        >
          <Input type="number" placeholder={t('Enter user ID')} />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('Status')}
          rules={[{ required: true, message: t('Please select status') }]}
        >
          <Select
            placeholder={t('Select status')}
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Pending', value: 'PENDING' },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EnrollmentFormDrawer;
