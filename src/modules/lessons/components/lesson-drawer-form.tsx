import { DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import useApp from '@/hooks/use-app';
import { TCreateArticleDto } from '@/modules/articles/dto/article.dto';
import lessonService from '@/modules/lessons/lesson.service';
import UploadFileComponent from '@/shared/components/upload-file';
import UploadImage from '@/shared/components/upload-image';
import { ArticleStatus, ArticlesType } from '@/shared/types/article.type';

import {
  ELessonStatus,
  TCreateLessonDto,
  TUpdateLessonDto,
} from '../dto/lesson.dto';
import { TLesson } from '../lesson.model';

const { Paragraph } = Typography;

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
  action: 'create' | 'edit';
  item: TLesson | null;
  refetch?: () => void;
  courseId?: number;
  latestLessonId?: number;
}

const LessonFormDrawer = ({
  open,
  setOpen,
  action,
  item,
  refetch,
  courseId,
  latestLessonId,
}: LessonFormDrawerProps) => {
  const { t, antdApp } = useApp();
  const { message } = antdApp;
  const [form] = Form.useForm<TCreateLessonDto | TUpdateLessonDto>();
  const [mediaFileIds, setMediaFileIds] = useState<number[]>([]);
  const [documentFileIds, setDocumentFileIds] = useState<number[]>([]);
  const [initialMediaFileIds, setInitialMediaFileIds] = useState<number[]>([]);
  const [initialDocumentFileIds, setInitialDocumentFileIds] = useState<
    number[]
  >([]);

  const { data: lesson } = useQuery({
    queryKey: ['/lessons', item?.id],
    queryFn: () => lessonService.getOne(item?.id || 0),
    enabled: !!item?.id && open && action === 'edit',
  });

  // Group attachments by type
  const mediaAttachments =
    lesson?.data?.attachments?.filter(
      (a) => a.type === 'VIDEO' || a.type === 'AUDIO',
    ) || [];
  const documentAttachments =
    lesson?.data?.attachments?.filter((a) => a.type === 'DOCUMENT') || [];

  useEffect(() => {
    if (courseId) {
      form.setFieldsValue({
        courseId,
      });
    }
    if (lesson?.data) {
      form.setFieldsValue({
        title: lesson.data.title,
        content: lesson.data.content,
        isImportant: lesson.data.isImportant,
        status: lesson.data.status,
        previousId: lesson.data.previousId,
      });
      // Set initial file ids for change detection
      setInitialMediaFileIds(
        lesson.data.attachments
          ?.filter((a) => a.type === 'VIDEO' || a.type === 'AUDIO')
          .map((a) => a.fileId) || [],
      );
      setInitialDocumentFileIds(
        lesson.data.attachments
          ?.filter((a) => a.type === 'DOCUMENT')
          .map((a) => a.fileId) || [],
      );
      setMediaFileIds(
        lesson.data.attachments
          ?.filter((a) => a.type === 'VIDEO' || a.type === 'AUDIO')
          .map((a) => a.fileId) || [],
      );
      setDocumentFileIds(
        lesson.data.attachments
          ?.filter((a) => a.type === 'DOCUMENT')
          .map((a) => a.fileId) || [],
      );
    }
  }, [lesson, form, courseId]);

  const createMutation = useMutation({
    mutationFn: (values: TCreateLessonDto) =>
      lessonService.createLesson(values),
    onSuccess: () => {
      message.success(t('Created successfully'));
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: TUpdateLessonDto) =>
      lessonService.updateLesson(item?.id || 0, values),
    onSuccess: () => {
      message.success(t('Updated successfully'));
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  const handleSubmit = async (values: TCreateLessonDto | TUpdateLessonDto) => {
    try {
      let payload: any = {
        ...values,
      };
      if (action === 'edit' && lesson?.data) {
        // Only include file ids if changed
        if (
          JSON.stringify(mediaFileIds) !== JSON.stringify(initialMediaFileIds)
        ) {
          payload.mediaFileIds = mediaFileIds;
        }
        if (
          JSON.stringify(documentFileIds) !==
          JSON.stringify(initialDocumentFileIds)
        ) {
          payload.documentFileIds = documentFileIds;
        }
        payload = {
          ...payload,
          title: values.title ?? lesson.data.title,
          content: values.content ?? lesson.data.content,
          isImportant: values.isImportant ?? lesson.data.isImportant,
          status: values.status ?? lesson.data.status,
          courseId: values.courseId ?? lesson.data.courseId,
          previousId: values.previousId ?? lesson.data.previousId,
        };
      } else {
        payload.mediaFileIds = mediaFileIds;
        payload.documentFileIds = documentFileIds;
        payload.courseId = courseId ?? values.courseId;
        payload.previousId = latestLessonId;
      }
      if (action === 'create') {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync(payload);
      }
      setOpen(false);
      form.resetFields();
      setMediaFileIds([]);
      setDocumentFileIds([]);
      refetch?.();
    } catch (error) {
      message.error(t('An error occurred'));
    }
  };

  const handleDeleteFile = async (
    fileId: number,
    type: 'media' | 'document',
  ) => {
    try {
      await lessonService.deleteFile(fileId);
      if (type === 'media') {
        setMediaFileIds(mediaFileIds.filter((id) => id !== fileId));
      } else {
        setDocumentFileIds(documentFileIds.filter((id) => id !== fileId));
      }
      message.success(t('Deleted successfully'));
      refetch?.();
    } catch (error) {
      message.error(t('An error occurred'));
    }
  };

  return (
    <Drawer
      title={
        action === 'create'
          ? t('lesson.create', 'Create Lesson')
          : t('lesson.update', 'Update Lesson')
      }
      width={720}
      onClose={() => setOpen(false)}
      open={open}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            {action === 'create'
              ? t('lesson.create', 'Create Lesson')
              : t('lesson.update', 'Update Lesson')}
          </Button>
        </Space>
      }
    >
      {/* Show attachments only when editing or viewing */}
      {action !== 'create' && (
        <div style={{ marginBottom: 24 }}>
          <Divider orientation="left">{t('lesson.media', 'Media')}</Divider>
          {mediaAttachments.length === 0 && (
            <Paragraph type="secondary">{t('Không có tài liệu')}</Paragraph>
          )}
          <ul>
            {mediaAttachments.map((a) => (
              <li
                key={a.fileId}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {a.type === 'VIDEO' ? '🎬' : '🎵'}{' '}
                <a
                  href={a.file.storagePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {a.file.fileName.normalize('NFC')}
                </a>
                <Popconfirm
                  title={t('Delete')}
                  description={t('Are you sure you want to delete this item?')}
                  onConfirm={() => handleDeleteFile(a.fileId, 'media')}
                  okText={t('Yes')}
                  cancelText={t('No')}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              </li>
            ))}
          </ul>
          <Divider orientation="left">
            {t('lesson.documents', 'Documents')}
          </Divider>
          {documentAttachments.length === 0 && (
            <Paragraph type="secondary">No documents.</Paragraph>
          )}
          <ul>
            {documentAttachments.map((a) => (
              <li
                key={a.fileId}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                📄{' '}
                <a
                  href={a.file.storagePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {a.file.fileName.normalize('NFC')}
                </a>
                <Popconfirm
                  title={t('Delete')}
                  description={t('Are you sure you want to delete this item?')}
                  onConfirm={() => handleDeleteFile(a.fileId, 'document')}
                  okText={t('Yes')}
                  cancelText={t('No')}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: ELessonStatus.DRAFT,
        }}
      >
        {/* Hidden courseId field to ensure it is included in payload */}
        <Form.Item name="courseId" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          name="title"
          label={t('Title')}
          rules={[{ required: true, message: t('Please enter title') }]}
        >
          <Input placeholder={t('Enter title')} />
        </Form.Item>

        <Form.Item
          name="mediaFileIds"
          label={t('Video / Audio', 'Video / Audio')}
        >
          <UploadFileComponent
            onFileSelect={setMediaFileIds}
            multiple={true}
            accept="video/*,audio/*"
            maxSize={100}
            folder="lessons/attachments/video-audio"
            description="Video / Audio"
          />
        </Form.Item>

        <Form.Item name="documentFileIds" label={t('Documents', 'Documents')}>
          <UploadFileComponent
            onFileSelect={setDocumentFileIds}
            multiple={true}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            maxSize={20}
            folder="lessons/attachments/documents"
            description="Documents"
          />
        </Form.Item>

        <Form.Item name="isImportant" label={t('Is important')}>
          <Switch />
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
          name="status"
          label={t('Status')}
          rules={[{ required: true, message: t('Please select status') }]}
        >
          <Select
            placeholder={t('Select status')}
            options={Object.values(ELessonStatus).map((status) => ({
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
