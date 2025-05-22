import { Button, Form, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

type TUsersFilterFormProps = {
  onSubmit: (values: any) => void;
};

const UsersFilterForm = ({ onSubmit }: TUsersFilterFormProps) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="users-filter-form"
      autoComplete="off"
      style={{ width: 360 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={(values) => onSubmit(values)}
      initialValues={{
        roles: [],
      }}
    >
      <Form.Item name="roles" label={t('Roles')}>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          options={[
            {
              label: t('Admin'),
              value: 'ADMIN',
            },
            {
              label: t('User'),
              value: 'USER',
            },
          ]}
          onChange={(e) => {
            form.setFieldValue('roles', e);
          }}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            type="dashed"
            htmlType="button"
            size="small"
            onClick={() => {
              form.resetFields();
              onSubmit({});
            }}
          >
            {t('Reset')}
          </Button>
          <Button type="primary" htmlType="submit" size="small">
            {t('Submit')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UsersFilterForm;
