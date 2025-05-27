import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect } from 'react';

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
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter course name' }]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter course description" rows={4} />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder="Select a category"
            options={[
              { label: 'Category 1', value: 1 },
              { label: 'Category 2', value: 2 },
              { label: 'Category 3', value: 3 },
            ]}
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

export default CourseFormDrawer;
