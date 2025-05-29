import { InboxOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Upload, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useApp from '@/hooks/use-app';
import { TCategory } from '@/modules/categories/category.model';
import categoryService from '@/modules/categories/category.service';
import libraryMaterialService from '@/modules/library-materials/library-materials.service';
import { TPaginated } from '@/shared/types/paginated.type';

import {
  TCreateLibraryMaterialDto,
  TUpdateLibraryMaterialDto,
} from '../dto/library-material.dto';

const { Dragger } = Upload;

type TLibraryMaterialFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => void;
};

export default function LibraryMaterialFormDrawer({
  open,
  setOpen,
  action,
  id,
  refetch,
}: TLibraryMaterialFormDrawerProps) {
  const { t } = useTranslation();
  const { antdApp } = useApp();
  const { message: messageApi } = antdApp;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['/categories/all'],
    queryFn: () => categoryService.getAllCategories({}),
  });

  const { data: libraryMaterial } = useQuery({
    queryKey: ['/library-materials', id],
    queryFn: () => libraryMaterialService.getLibraryMaterial(id!),
    enabled: !!id && action === 'update',
  });

  const createLibraryMaterial = useMutation({
    mutationFn: (formData: FormData) =>
      libraryMaterialService.createLibraryMaterial(formData),
    onSuccess: () => {
      messageApi.success(t('Created successfully'));
      setOpen(false);
      form.resetFields();
      setFileList([]);
      refetch?.();
    },
    onError: () => {
      messageApi.error(t('An error occurred'));
    },
  });

  const updateLibraryMaterial = useMutation({
    mutationFn: (values: any) =>
      libraryMaterialService.updateLibraryMaterial(id!, values),
    onSuccess: () => {
      messageApi.success(t('Updated successfully'));
      setOpen(false);
      form.resetFields();
      refetch?.();
    },
    onError: () => {
      messageApi.error(t('An error occurred'));
    },
  });

  const handleSubmit = async (
    values: TCreateLibraryMaterialDto | TUpdateLibraryMaterialDto,
  ) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'tags') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      fileList.forEach((file) => {
        formData.append('files', file.originFileObj);
      });

      if (action === 'create') {
        await libraryMaterialService.createLibraryMaterial(formData);
        message.success(t('Created successfully'));
      } else {
        await libraryMaterialService.updateLibraryMaterial(
          id!,
          values as TUpdateLibraryMaterialDto,
        );
        message.success(t('Updated successfully'));
      }
      setOpen(false);
      form.resetFields();
      setFileList([]);
      refetch?.();
    } catch (error) {
      message.error(t('An error occurred'));
    }
  };

  return (
    <Drawer
      title={t(
        action === 'create'
          ? 'Create Library Material'
          : 'Update Library Material',
      )}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Button type="primary" onClick={() => form.submit()}>
          {action === 'create' ? t('Create') : t('Update')}
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={libraryMaterial}
      >
        <Form.Item
          name="title"
          label={t('Title')}
          rules={[{ required: true, message: t('Please enter title') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label={t('Description')}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label={t('Category')}
          rules={[{ required: true, message: t('Please select category') }]}
        >
          <Select
            options={(categories?.data as TPaginated<TCategory>)?.items.map(
              (category) => ({
                label: category.name,
                value: category.id,
              }),
            )}
          />
        </Form.Item>

        <Form.Item name="tags" label={t('Tags')}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder={t('Enter tags')}
          />
        </Form.Item>

        {action === 'create' && (
          <Form.Item
            label={t('Files')}
            rules={[{ required: true, message: t('Please upload files!') }]}
          >
            <Dragger
              multiple
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              accept=".pdf,.doc,.docx,.mp4,.mpeg,.mov,.avi,.wmv,.mp3,.wav,.ogg,.m4a"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                {t('Click or drag files to this area to upload')}
              </p>
              <p className="ant-upload-hint">
                {t(
                  'Support for PDF, DOC, DOCX, MP4, MPEG, MOV, AVI, WMV, MP3, WAV, OGG, M4A',
                )}
              </p>
            </Dragger>
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
}
