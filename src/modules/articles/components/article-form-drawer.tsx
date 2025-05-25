import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import useApp from '@/hooks/use-app';
import articleService from '@/modules/articles/article.service';
import categoryService from '@/modules/categories/category.service';
import UploadAvatar from '@/modules/users/components/upload-avatar';
import UploadImage from '@/shared/components/upload-image';
import { ArticleStatus, ArticlesType } from '@/shared/types/article.type';

import { TCreateArticleDto, TUpdateArticleDto } from '../dto/article.dto';

const QuillWrapper = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const handleChange = useCallback(
    (content: string) => {
      onChange(content);
    },
    [onChange],
  );

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={handleChange}
      style={{ height: '200px', marginBottom: '50px' }}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
      }}
    />
  );
};

interface ArticleFormDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => void;
}

const ArticleFormDrawer = ({
  open,
  setOpen,
  action,
  id,
  refetch,
}: ArticleFormDrawerProps) => {
  const { t, antdApp } = useApp();
  const { message } = antdApp;
  const [form] = Form.useForm<TCreateArticleDto | TUpdateArticleDto>();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['/categories/all'],
    queryFn: () =>
      categoryService.getAllCategories({
        take: 100,
        skip: 0,
        parentId: null,
      }),
  });

  const { data: article } = useQuery({
    queryKey: ['/articles', id],
    queryFn: () => articleService.getOne(id!),
    enabled: !!id && action === 'update',
  });

  useEffect(() => {
    if (article?.data) {
      form.setFieldsValue({
        title: article.data.title,
        content: article.data.content,
        categoryId: article.data.categoryId,
        type: article.data.type,
        status: article.data.status,
        thumbnailUrl: article.data.thumbnailUrl,
      });
    }
  }, [article, form]);

  const handleSubmit = async (
    values: TCreateArticleDto | TUpdateArticleDto,
  ) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string);
        }
      });

      if (thumbnailFile) {
        formData.append('file', thumbnailFile);
      }

      if (action === 'create') {
        await articleService.createArticle(formData);
        message.success(t('Created successfully'));
      } else {
        await articleService.updateArticle(id!, values as TUpdateArticleDto);
        message.success(t('Updated successfully'));
      }
      setOpen(false);
      form.resetFields();
      setThumbnailFile(null);
      refetch?.();
    } catch (error) {
      message.error(t('An error occurred'));
    }
  };

  return (
    <Drawer
      title={
        action === 'create' ? t('Create new article') : t('Update article')
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: ArticlesType.BULLETIN,
          status: ArticleStatus.DRAFT,
        }}
      >
        <Form.Item
          name="title"
          label={t('Title')}
          rules={[{ required: true, message: t('Please enter title') }]}
        >
          <Input placeholder={t('Enter title')} />
        </Form.Item>

        <Form.Item name="thumbnailUrl" label={t('Image')}>
          <UploadImage
            onFileSelect={setThumbnailFile}
            initialImageUrl={article?.data?.thumbnailUrl}
            aspectRatio={16 / 9}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label={t('Content')}
          rules={[{ required: true, message: t('Please enter content') }]}
        >
          <QuillWrapper
            value={form.getFieldValue('content') || ''}
            onChange={(value) => {
              form.setFieldValue('content', value);
            }}
          />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label={t('Category')}
          rules={[{ required: true, message: t('Please select category') }]}
        >
          <Select
            placeholder={t('Select category')}
            options={categories?.data.items.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label={t('Type')}
          rules={[{ required: true, message: t('Please select type') }]}
        >
          <Select
            placeholder={t('Select type')}
            options={Object.values(ArticlesType).map((type) => ({
              label: type,
              value: type,
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
            options={Object.values(ArticleStatus).map((status) => ({
              label: status,
              value: status,
            }))}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ArticleFormDrawer;
