import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import slugify from 'slugify';

import categoryService from '@/modules/categories/category.service';
import QuillWrapper from '@/shared/components/quill-wrapper';

import { TCourse, TCourseCreate, TCourseUpdate } from '../course.model';

interface CourseFormDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: TCourseCreate | TCourseUpdate) => void;
  initialValues?: Partial<TCourse>;
  loading?: boolean;
}

const CourseFormDrawer = ({
  open,
  setOpen,
  onSubmit,
  initialValues,
  loading,
}: CourseFormDrawerProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      categoryService.getAllCategories({
        parentId: 13,
      }),
  });

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.name) {
      const slug = slugify(changedValues.name, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      form.setFieldsValue({
        slug,
      });
    }
  };

  return (
    <Drawer
      title={initialValues ? 'Edit Course' : 'Create Course'}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter course name' }]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <QuillWrapper
            value={form.getFieldValue('description') || ''}
            onChange={(value) => {
              form.setFieldValue('description', value);
            }}
          />
        </Form.Item>

        <Form.Item name="slug" label={t('Slug')}>
          <Input />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder="Select a category"
            options={categoriesQuery.data?.data.items.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select
            placeholder="Select a status"
            options={[
              { label: 'Public', value: 'PUBLIC' },
              { label: 'Private', value: 'PRIVATE' },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CourseFormDrawer;
