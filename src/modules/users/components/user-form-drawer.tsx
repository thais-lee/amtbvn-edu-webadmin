import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Radio,
  Skeleton,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { EUserGender } from '@/modules/users/user.model';

import userService from '../user.service';

type TUserFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => Promise<any>;
};

const UserFormDrawer: React.FC<TUserFormDrawerProps> = ({
  open,
  setOpen,
  action,
  id = 0,
  refetch,
}: TUserFormDrawerProps) => {
  const { t } = useTranslation();

  const { message } = App.useApp();
  const [form] = Form.useForm();

  const getQuery = useQuery({
    queryKey: ['/users/get-one', id],
    enabled: !!id,
    queryFn: () => (id ? userService.getUser(id) : undefined),
  });

  useEffect(() => {
    if (getQuery.data) {
      const user = getQuery.data.data;
      form.setFieldsValue({
        ...user,
        dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      });
    }
  }, [getQuery.data, form]);

  const createMutation = useMutation({
    mutationFn: (data: any) => userService.createUser(data),
    onSuccess: async () => {
      if (refetch) await refetch();
      message.success(t('Created successfully'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => userService.updateUser(id, data),
    onSuccess: async () => {
      if (refetch) await refetch();
      message.success(t('Updated successfully'));
      setOpen(false);
      // form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    if (action === 'create') {
      form.resetFields();
    }
  }, [action, form]);

  return (
    <Drawer
      forceRender
      title={action === 'create' ? t('Create new user') : t('Update user')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending || updateUserMutation.isPending}
            disabled={getQuery.isLoading}
            onClick={() => {
              form.submit();
            }}
          >
            {t('Submit')}
          </Button>
        </Space>
      }
    >
      {getQuery.isLoading ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          name="users"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => {
            if (action === 'create') {
              createMutation.mutate({
                ...values,
                dateOfBirth: dayjs(values.dateOfBirth).toISOString(),
              });
            } else {
              updateUserMutation.mutate({
                ...values,
                id,
                dateOfBirth: dayjs(values.dateOfBirth).toISOString(),
              });
            }
          }}
        >
          <Form.Item name="firstName" label={t('First name')} required>
            <Input />
          </Form.Item>

          <Form.Item name="lastName" label={t('Last name')}>
            <Input />
          </Form.Item>

          <Form.Item name="gender" label={t('Gender')}>
            <Radio.Group>
              <Radio value={EUserGender.MALE}>{t('Male')}</Radio>
              <Radio value={EUserGender.FEMALE}>{t('Female')}</Radio>
              <Radio value={EUserGender.OTHER}>{t('Other')}</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="phoneNumber" label={t('Phone number')}>
            <Input />
          </Form.Item>

          <Form.Item name="dateOfBirth" label={t('Date of birth')}>
            <DatePicker />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default UserFormDrawer;
