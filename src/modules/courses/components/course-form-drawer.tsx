import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Space, Switch } from 'antd';
import { useEffect } from 'react';
import slugify from 'slugify';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/categories/category.service';
import QuillWrapper from '@/shared/components/quill-wrapper';
import UploadFileComponent from '@/shared/components/upload-file-for-url';

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
  const { t } = useApp();

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

  const handleValuesChange = (changedValues: any, _: any) => {
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
      title={initialValues ? t('Edit Course') : t('Create Course')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {t('Submit')}
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
          label={t('Name')}
          rules={[{ required: true, message: t('Please enter course name') }]}
        >
          <Input placeholder={t('Enter course name')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('Description')}
          rules={[{ required: true, message: t('Please enter description') }]}
        >
          <QuillWrapper
            value={form.getFieldValue('description') || ''}
            onChange={(value) => {
              form.setFieldValue('description', value);
            }}
          />
        </Form.Item>

        <Form.Item name="imageFileUrl" label={t('Image')}>
          <UploadFileComponent
            onFileSelect={(files) => {
              form.setFieldValue('imageFileUrl', files[0]?.url || undefined);
            }}
            initialFiles={
              initialValues?.imageFileUrl
                ? [
                    {
                      id: 0,
                      fileName: 'Image',
                      url: initialValues.imageFileUrl,
                    },
                  ]
                : []
            }
            accept="image/*"
            maxSize={5}
            folder="course-images"
            description={t('Course image')}
            multiple={false}
          />
        </Form.Item>

        <Form.Item name="bannerFileUrl" label={t('Banner')}>
          <UploadFileComponent
            onFileSelect={(files) => {
              form.setFieldValue('bannerFileUrl', files[0]?.url || undefined);
            }}
            initialFiles={
              initialValues?.bannerFileUrl
                ? [
                    {
                      id: 0,
                      fileName: 'Banner',
                      url: initialValues.bannerFileUrl,
                    },
                  ]
                : []
            }
            accept="image/*"
            maxSize={5}
            folder="course-banners"
            description={t('Course banner')}
            multiple={false}
          />
        </Form.Item>

        <Form.Item name="slug" label={t('Slug')}>
          <Input />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label={t('Category')}
          rules={[{ required: true, message: t('Please select category') }]}
        >
          <Select
            placeholder={t('Select category')}
            options={categoriesQuery.data?.data.items.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
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
              { label: 'Public', value: 'PUBLIC' },
              { label: 'Private', value: 'PRIVATE' },
            ]}
          />
        </Form.Item>

        <Form.Item name="requireApproval" label={t('Require Approval')}>
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CourseFormDrawer;
