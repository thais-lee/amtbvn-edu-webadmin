import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Skeleton,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import slugify from 'slugify';

import UploadAvatar from '@/modules/users/components/upload-avatar';
import SlugInput from '@/shared/components/slug-input';

import categoryService from '../category.service';

type TCategoryFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => Promise<any>;
  parentCategoriesId?: number;
};

const CategoryFormDrawer: React.FC<TCategoryFormDrawerProps> = ({
  open,
  setOpen,
  action,
  id = 0,
  refetch,
  parentCategoriesId = undefined,
}: TCategoryFormDrawerProps) => {
  const { t } = useTranslation();

  const { message } = App.useApp();
  const [form] = Form.useForm();

  const parentCategoriesQuery = useQuery({
    queryKey: ['/categories/all'],
    queryFn: () =>
      categoryService.getAllCategories({ parentId: parentCategoriesId }),
  });

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.name) {
      form.setFieldsValue({
        slug: slugify(changedValues.name, {
          lower: true,
          strict: true,
          locale: 'vi',
        }),
      });
    }
  };

  const getQuery = useQuery({
    queryKey: ['/categories/get-one', id],
    enabled: !!id,
    queryFn: () => (id ? categoryService.getOne(id) : undefined),
  });

  useEffect(() => {
    if (getQuery.data) {
      const category = getQuery.data.data;
      form.setFieldsValue({
        ...category,
      });
    }
  }, [getQuery.data, form]);

  const createMutation = useMutation({
    mutationFn: (data: any) => categoryService.createCategory(data),
    onSuccess: async () => {
      if (refetch) await refetch();
      message.success(t('Created successfully'));
      setOpen(false);
      parentCategoriesQuery.refetch();
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => categoryService.updateCategory(id, data),
    onSuccess: async () => {
      if (refetch) await refetch();
      message.success(t('Updated successfully'));
      setOpen(false);
      form.resetFields();
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
      title={
        action === 'create' ? t('Create new category') : t('Update category')
      }
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
          onValuesChange={handleValuesChange}
          onFinish={(values) => {
            if (action === 'create') {
              createMutation.mutate({
                ...values,
              });
            } else {
              updateUserMutation.mutate({
                ...values,
                id,
              });
            }
          }}
        >
          <Form.Item name="name" label={t('Name')} required>
            <Input />
          </Form.Item>

          <Form.Item name="slug" label={t('Slug')}>
            <Input />
          </Form.Item>

          <Form.Item name="parentId" label={t('Parent category')}>
            <Select
              loading={parentCategoriesQuery.isLoading}
              placeholder={t('Parent category')}
            >
              <Select.Option value={null}>{t('Parent category')}</Select.Option>
              {parentCategoriesQuery.data?.data.items.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name} ({category.slug})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="imageUrl" label={t('Image')}>
            <UploadAvatar />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default CategoryFormDrawer;
