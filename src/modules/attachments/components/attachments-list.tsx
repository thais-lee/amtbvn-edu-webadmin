import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  Table,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { TAttachment } from '../attachment.model';
import attachmentService from '../attachment.service';

export const AttachmentsList: React.FC = () => {
  const [attachments, setAttachments] = useState<TAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await attachmentService.getAttachments();
      setAttachments(data);
    } catch (error) {
      message.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };
      await attachmentService.createAttachment(formattedValues);
      message.success('Activity created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchActivities();
    } catch (error) {
      message.error('Failed to create activity');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingId) return;
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };
      await attachmentService.updateAttachment(editingId, formattedValues);
      message.success('Activity updated successfully');
      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchActivities();
    } catch (error) {
      message.error('Failed to update activity');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await attachmentService.deleteAttachment(id);
      message.success('Activity deleted successfully');
      fetchActivities();
    } catch (error) {
      message.error('Failed to delete activity');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TAttachment) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue({
                ...record,
              });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditingId(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Create Activity
      </Button>

      <Table
        columns={columns}
        dataSource={attachments}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingId ? 'Edit Activity' : 'Create Activity'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingId ? handleUpdate : handleCreate}
          layout="vertical"
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            name="courseId"
            label="Course ID"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
