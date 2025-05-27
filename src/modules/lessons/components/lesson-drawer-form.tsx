import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import useApp from '@/hooks/use-app';
import { TCreateArticleDto } from '@/modules/articles/dto/article.dto';
import lessonService from '@/modules/lessons/lesson.service';
import UploadImage from '@/shared/components/upload-image';
import { ArticleStatus, ArticlesType } from '@/shared/types/article.type';

import { TCreateLessonDto, TUpdateLessonDto } from '../dto/lesson.dto';

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

interface LessonFormDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => void;
}

const LessonFormDrawer = ({
  open,
  setOpen,
  action,
  id,
  refetch,
}: LessonFormDrawerProps) => {
  const { t, antdApp } = useApp();
  const { message } = antdApp;
  const [form] = Form.useForm<TCreateArticleDto | TUpdateLessonDto>();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { data: lesson } = useQuery({
    queryKey: ['/articles', id],
    queryFn: () => lessonService.getOne(id!),
    enabled: !!id && action === 'update',
  });

  useEffect(() => {
    if (lesson?.data) {
      form.setFieldsValue({
        title: lesson.data.title,
        content: lesson.data.content,
      });
    }
  }, [lesson, form]);

  const handleSubmit = async (values: TCreateArticleDto | TUpdateLessonDto) => {
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
        // await lessonService.createLesson(
        //   formData as unknown as TCreateLessonDto,
        // );
        message.success(t('Created successfully'));
      } else {
        // await lessonService.updateLesson(id!, values as TUpdateLessonDto);
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
            initialImageUrl={lesson?.data?.title}
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

export default LessonFormDrawer;
