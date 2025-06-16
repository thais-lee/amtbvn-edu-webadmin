import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TCategory } from '@/modules/categories/category.model';
import categoryService from '@/modules/categories/category.service';
import libraryMaterialService from '@/modules/library-materials/library-materials.service';
import UploadFileComponent from '@/shared/components/upload-file';
import { TPaginated } from '@/shared/types/paginated.type';

import {
  TCreateLibraryMaterialDto,
  TUpdateLibraryMaterialDto,
} from '../dto/library-material.dto';

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
  const { t } = useApp();
  const { antdApp } = useApp();
  const { message: messageApi } = antdApp;
  const [form] = Form.useForm();
  const [fileIds, setFileIds] = useState<number[]>([]);
  const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['/categories/all'],
    queryFn: () => categoryService.getAllCategories({}),
  });

  const { data: libraryMaterial } = useQuery({
    queryKey: ['/library-materials', id],
    queryFn: () => libraryMaterialService.getLibraryMaterial(id!),
    enabled: !!id && action === 'update' && open,
  });

  // Update form values and file list when library material data changes
  useEffect(() => {
    if (libraryMaterial && action === 'update') {
      // Update form fields
      form.setFieldsValue({
        title: libraryMaterial.title,
        description: libraryMaterial.description,
        categoryId: libraryMaterial.categoryId,
        tags: libraryMaterial.tags,
      });

      // Update file list with existing files
      if (libraryMaterial.files && libraryMaterial.files.length > 0) {
        setFileIds(
          libraryMaterial.files
            .filter((file: any) => !removedFileIds.includes(file.id))
            .map((file: any) => file.id),
        );
      }
    }
  }, [libraryMaterial, action, form, removedFileIds]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setFileIds([]);
      setRemovedFileIds([]);
    }
  }, [open, form]);

  const updateLibraryMaterial = useMutation({
    mutationFn: (input: TUpdateLibraryMaterialDto) =>
      libraryMaterialService.updateLibraryMaterial(id!, input),
    onSuccess: () => {
      messageApi.success(t('Updated successfully'));
      setOpen(false);
      form.resetFields();
      setFileIds([]);
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
      const payload: any = {
        ...values,
        fileIds,
        fileIdsToRemove: removedFileIds,
      };
      if (action === 'create') {
        await libraryMaterialService.createLibraryMaterial(payload);
        message.success(t('Created successfully'));
      } else {
        await updateLibraryMaterial.mutateAsync(payload);
        message.success(t('Updated successfully'));
      }
      setOpen(false);
      form.resetFields();
      setFileIds([]);
      setRemovedFileIds([]);
      refetch?.();
    } catch (error) {
      message.error(`${t('An error occurred')}: ${error}`);
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
        {/* Existing files section */}
        {libraryMaterial?.files && libraryMaterial.files.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <b>{t('Existing Files')}</b>
            <ul>
              {libraryMaterial.files
                .filter((file: any) => !removedFileIds.includes(file.id))
                .map((file: any) => (
                  <li
                    key={file.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <a
                      href={file.storagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.fileName.normalize('NFC')}
                    </a>
                    <Button
                      size="small"
                      danger
                      onClick={() =>
                        setRemovedFileIds((ids) => [...ids, file.id])
                      }
                      style={{ marginLeft: 8 }}
                    >
                      {t('Remove')}
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        )}

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
                label: category.name + ' (' + category.slug + ')',
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

        <Form.Item label={t('Files')} required={action === 'create'}>
          <UploadFileComponent
            onFileSelect={setFileIds}
            initialFiles={libraryMaterial?.files
              ?.filter((file: any) => !removedFileIds.includes(file.id))
              .map((file: any) => ({
                id: file.id,
                fileName: file.fileName,
                url: file.storagePath,
              }))}
            multiple
            //TODO: add more file types for video/ audio/ image
            accept=".pdf,.doc,.docx,.mp4,.mpeg,.mov,.avi,.wmv,.mp3,.wav,.ogg,.m4a,.jpg,.jpeg,.png,.gif,.webp,.svg,.tiff"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
