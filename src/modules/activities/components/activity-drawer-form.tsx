import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TLesson } from '@/modules/lessons/lesson.model';
import lessonService from '@/modules/lessons/lesson.service';

import activityService from '../activity.service';
import {
  EActivityQuestionType,
  TCreateActivityDto,
  TUpdateActivityDto,
} from '../dto/activity.dto';

interface ActivityFormDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => void;
  courseId: number;
}

const ActivityFormDrawer = ({
  open,
  setOpen,
  action,
  id,
  refetch,
  courseId,
}: ActivityFormDrawerProps) => {
  const { t, antdApp } = useApp();
  const { message } = antdApp;
  const [form] = Form.useForm<TCreateActivityDto | TUpdateActivityDto>();
  const [activityScope, setActivityScope] = useState<'COURSE' | 'LESSON'>(
    'COURSE',
  );
  const [lessonOptions, setLessonOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const { isFetching } = useQuery({
    queryKey: ['lesson-search', courseId],
    queryFn: async () => {
      const response = await lessonService.getAllLessons({
        courseId,
      });
      setLessonOptions(
        (response.data ?? []).map((lesson: TLesson) => ({
          label: lesson.title,
          value: lesson.id,
        })),
      );
      return response;
    },
    enabled: activityScope === 'LESSON',
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  const { data: activity } = useQuery({
    queryKey: ['activities', id],
    queryFn: () => activityService.getOne(id!),
    enabled: !!id && action === 'update',
  });

  useEffect(() => {
    if (activity?.data) {
      form.setFieldsValue({
        title: activity.data.title,
        description: activity.data.description,
        type: activity.data.type,
        courseId: activity.data.courseId,
        status: activity.data.status,
        timeLimitMinutes: activity.data.timeLimitMinutes,
        dueDate: activity.data.dueDate
          ? dayjs(activity.data.dueDate)
          : undefined,
        maxAttempts: activity.data.maxAttempts,
        passScore: activity.data.passScore,
        lessonId: activity.data.lessonId ?? undefined,
        questions: activity.data.questions,
      });
      setActivityScope(activity.data.lessonId ? 'LESSON' : 'COURSE');
    }
  }, [activity, form, open]);

  useEffect(() => {
    if (activityScope === 'COURSE') {
      form.setFieldsValue({ courseId });
    }
    if (activityScope === 'LESSON') {
      form.setFieldsValue({ courseId: undefined });
    }
  }, [activityScope, courseId, form]);

  useEffect(() => {
    if (open && action === 'create') {
      form.resetFields();
      setActivityScope('COURSE');
      form.setFieldsValue({
        questions: [],
        courseId,
        lessonId: undefined,
        title: '',
        description: '',
        type: 'QUIZ',
        status: 'DRAFT',
        timeLimitMinutes: 0,
      });
    }
  }, [open, action, form, courseId]);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => activityService.createActivity(data),
    onSuccess: () => {
      message.success(t('Created successfully'));
      setOpen(false);
      form.resetFields();
      refetch?.();
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => activityService.updateActivity(id!, data),
    onSuccess: async () => {
      message.success(t('Updated successfully'));
      setOpen(false);
      form.resetFields();
      refetch?.();
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  const handleSubmit = async (
    values: TCreateActivityDto | TUpdateActivityDto,
  ) => {
    const questionsWithIsCorrect = (values.questions ?? []).map((q) => ({
      ...q,
      options: (q.options ?? []).map((opt) => ({
        ...opt,
        isCorrect: typeof opt.isCorrect === 'boolean' ? opt.isCorrect : false,
      })),
    }));

    const formData = new FormData();
    Object.entries({
      ...values,
      questions: questionsWithIsCorrect,
    }).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'questions') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (action === 'create') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
    // setOpen(false);
    // form.resetFields();
    // refetch?.();
  };

  // Helper: TRUE_FALSE options
  const TRUE_FALSE_OPTIONS = [
    { text: 'Đúng', isCorrect: false },
    { text: 'Sai', isCorrect: false },
  ];

  return (
    <Drawer
      title={
        action === 'create' ? t('Create new activity') : t('Update activity')
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={t('Activity for')}>
          <Radio.Group
            value={activityScope}
            onChange={(e) => setActivityScope(e.target.value)}
            options={[
              { label: t('Course'), value: 'COURSE' },
              { label: t('Lesson'), value: 'LESSON' },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        {activityScope === 'COURSE' && (
          <Form.Item name="courseId" initialValue={courseId} hidden>
            <Input type="hidden" />
          </Form.Item>
        )}
        {activityScope === 'LESSON' && (
          <Form.Item
            name="lessonId"
            label={t('Lesson')}
            rules={[{ required: true, message: t('Please select a lesson') }]}
          >
            <Select
              filterOption={false}
              notFoundContent={isFetching ? <span>Loading...</span> : null}
              options={lessonOptions}
            />
          </Form.Item>
        )}
        <Form.Item
          name="title"
          label={t('Title')}
          rules={[{ required: true, message: t('Please enter title') }]}
        >
          <Input placeholder={t('Enter title')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('Description')}
          rules={[{ required: true, message: t('Please enter description') }]}
        >
          <Input.TextArea placeholder={t('Enter description')} />
        </Form.Item>

        <Form.Item
          name="type"
          label={t('Type')}
          rules={[{ required: true, message: t('Please select type') }]}
        >
          <Select
            placeholder={t('Select type')}
            options={[
              { label: 'Assignment', value: 'ASSIGNMENT' },
              { label: 'Quiz', value: 'QUIZ' },
              { label: 'Discussion', value: 'DISCUSSION' },
            ]}
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
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Archived', value: 'ARCHIVED' },
            ]}
          />
        </Form.Item>
        <Space
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Form.Item
            name="timeLimitMinutes"
            label={t('Time limit (minutes)')}
            rules={[{ required: true, message: t('Please enter time limit') }]}
          >
            <InputNumber placeholder={t('Enter time limit')} />
          </Form.Item>

          <Form.Item
            name="maxAttempts"
            label={t('Max attempts')}
            rules={[
              { required: true, message: t('Please enter max attempts') },
            ]}
          >
            <InputNumber placeholder={t('Enter max attempts')} />
          </Form.Item>
          <Form.Item
            name="passScore"
            label={t('Pass score')}
            rules={[{ required: true, message: t('Please enter pass score') }]}
          >
            <InputNumber placeholder={t('Enter pass score')} />
          </Form.Item>
        </Space>
        <Form.Item
          name="dueDate"
          label={t('Due date')}
          rules={[{ required: true, message: t('Please select due date') }]}
        >
          <Space>
            <DatePicker
              mode="date"
              format="HH:mm DD/MM/YYYY"
              placeholder={t('Select due date')}
              onChange={(date) => {
                if (date) {
                  form.setFieldsValue({
                    dueDate: date.format('YYYY-MM-DD HH:mm'),
                  });
                }
              }}
            />
            <TimePicker
              format="HH:mm"
              placeholder={t('Select time')}
              onChange={(time) => {
                if (time) {
                  form.setFieldsValue({
                    dueDate: time.format('YYYY-MM-DD HH:mm'),
                  });
                }
              }}
            />
          </Space>
        </Form.Item>
        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              <Divider orientation="left">{t('Questions')}</Divider>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  style={{ marginBottom: 16, background: '#fafafa' }}
                  size="small"
                  title={`${t('Question')} ${name + 1}`}
                  extra={
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: 'red' }}
                    />
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'question']}
                    label={t('Question')}
                    rules={[
                      { required: true, message: t('Please enter question') },
                    ]}
                  >
                    <Input.TextArea
                      placeholder={t('Enter question')}
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'type']}
                    label={t('Type')}
                    rules={[
                      { required: true, message: t('Please select type') },
                    ]}
                  >
                    <Select
                      placeholder={t('Select type')}
                      options={[
                        {
                          label: t('Multiple Choice'),
                          value: EActivityQuestionType.MULTIPLE_CHOICE,
                        },
                        {
                          label: t('True/False'),
                          value: EActivityQuestionType.TRUE_FALSE,
                        },
                        {
                          label: t('Short Answer'),
                          value: EActivityQuestionType.SHORT_ANSWER,
                        },
                        {
                          label: t('Essay'),
                          value: EActivityQuestionType.ESSAY,
                        },
                      ]}
                      onChange={(val) => {
                        // Nếu chọn TRUE_FALSE thì set options mặc định
                        if (val === EActivityQuestionType.TRUE_FALSE) {
                          const questions =
                            form.getFieldValue('questions') || [];
                          questions[name] = {
                            ...questions[name],
                            options: TRUE_FALSE_OPTIONS.map((opt) => ({
                              ...opt,
                            })),
                          };
                          form.setFieldsValue({ questions });
                        }
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'points']}
                    label={t('Points')}
                    rules={[
                      { required: true, message: t('Please enter points') },
                    ]}
                  >
                    <InputNumber placeholder={t('Enter points')} />
                  </Form.Item>
                  {/* Options cho TRUE_FALSE */}
                  <Form.Item shouldUpdate>
                    {() => {
                      const type = form.getFieldValue([
                        'questions',
                        name,
                        'type',
                      ]);
                      if (type === EActivityQuestionType.TRUE_FALSE) {
                        return (
                          <Form.List name={[name, 'options']}>
                            {(optionFields) => (
                              <>
                                <Divider
                                  orientation="left"
                                  style={{ fontSize: 13 }}
                                >
                                  {t('Options')}
                                </Divider>
                                {optionFields.map(
                                  ({
                                    key: optionKey,
                                    name: optionName,
                                    ...optionRestField
                                  }) => (
                                    <Space
                                      key={optionKey}
                                      align="baseline"
                                      style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                      }}
                                    >
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'text']}
                                        style={{ marginRight: 8, minWidth: 60 }}
                                      >
                                        <Input disabled />
                                      </Form.Item>
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'isCorrect']}
                                        valuePropName="checked"
                                        style={{ margin: 0 }}
                                      >
                                        <Checkbox>{t('Correct')}</Checkbox>
                                      </Form.Item>
                                    </Space>
                                  ),
                                )}
                              </>
                            )}
                          </Form.List>
                        );
                      }
                      // Nếu là MULTIPLE_CHOICE thì render như cũ
                      if (type === EActivityQuestionType.MULTIPLE_CHOICE) {
                        return (
                          <Form.List name={[name, 'options']}>
                            {(
                              optionFields,
                              { add: addOption, remove: removeOption },
                            ) => (
                              <>
                                <Divider
                                  orientation="left"
                                  style={{ fontSize: 13 }}
                                >
                                  {t('Options')}
                                </Divider>
                                {optionFields.map(
                                  ({
                                    key: optionKey,
                                    name: optionName,
                                    ...optionRestField
                                  }) => (
                                    <Space
                                      key={optionKey}
                                      align="baseline"
                                      style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                      }}
                                    >
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'text']}
                                        rules={[
                                          {
                                            required: true,
                                            message: t('Option text required'),
                                          },
                                        ]}
                                      >
                                        <Input placeholder={t('Option text')} />
                                      </Form.Item>
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'isCorrect']}
                                        valuePropName="checked"
                                        style={{ margin: 0 }}
                                      >
                                        <Checkbox>{t('Correct')}</Checkbox>
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        onClick={() => removeOption(optionName)}
                                      />
                                    </Space>
                                  ),
                                )}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => addOption()}
                                    icon={<PlusOutlined />}
                                    size="small"
                                  >
                                    {t('Add Option')}
                                  </Button>
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                >
                  {t('Add Question')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
};

export default ActivityFormDrawer;
