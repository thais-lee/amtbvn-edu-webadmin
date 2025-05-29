import { useQuery } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { TEnrollment } from '../enrollment.model';
import enrollmentService from '../enrollment.service';

export const EnrollmentList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () =>
      enrollmentService.getAllEnrollments({
        take: 100,
        skip: 0,
      }),
  });

  const handleCreate = async (values: any) => {
    try {
      await enrollmentService.createEnrollment(values);
      message.success('Enrollment created successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create enrollment');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingId) return;
    try {
      await enrollmentService.updateEnrollment(editingId, values);
      message.success('Enrollment updated successfully');
      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error('Failed to update enrollment');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await enrollmentService.deleteEnrollment(id);
      message.success('Enrollment deleted successfully');
    } catch (error) {
      message.error('Failed to delete enrollment');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
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
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TEnrollment) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue(record);
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
        Create Enrollment
      </Button>

      <Table
        columns={columns}
        dataSource={enrollments?.data || []}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingId ? 'Edit Enrollment' : 'Create Enrollment'}
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
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <Input type="number" />
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
