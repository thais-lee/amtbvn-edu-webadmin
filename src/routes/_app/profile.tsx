import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Radio,
  Skeleton,
} from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import UploadAvatar from '@/modules/users/components/upload-avatar';
import { TUpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { EUserGender } from '@/modules/users/user.model';
import userService from '@/modules/users/user.service';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { t, antdApp } = useApp();

  const { user } = useAuthStore();

  const [form] = Form.useForm();

  const updateUserMutation = useMutation({
    mutationFn: (data: TUpdateUserDto) => userService.updateMe(data),
    onSuccess: async () => {
      antdApp.message.success(t('Updated successfully'));
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  return (
    <Flex vertical>
      <TitleHeading>{t('Profile')}</TitleHeading>

      <Divider />

      <Flex
        css={css`
          width: 100%;
        `}
        justify="center"
      >
        {!user ? (
          <Skeleton active />
        ) : (
          <Form
            css={css`
              width: 600px;
            `}
            form={form}
            name="users"
            autoComplete="off"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{
              ...user,
              dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
            }}
            onFinish={(values) => {
              updateUserMutation.mutate(values);
            }}
          >
            <Form.Item<TUpdateUserDto>
              name="firstName"
              label={t('First name')}
              required
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<TUpdateUserDto> name="lastName" label={t('Last name')}>
              <Input />
            </Form.Item>

            <Form.Item<TUpdateUserDto> name="gender" label={t('Gender')}>
              <Radio.Group>
                <Radio value={EUserGender.MALE}>{t('Male')}</Radio>
                <Radio value={EUserGender.FEMALE}>{t('Female')}</Radio>
                <Radio value={EUserGender.OTHER}>{t('Other')}</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item<TUpdateUserDto>
              name="phoneNumber"
              label={t('Phone number')}
            >
              <Input />
            </Form.Item>

            <Form.Item<TUpdateUserDto>
              name="dateOfBirth"
              label={t('Date of birth')}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item label={t('Avatar')}>
              <UploadAvatar initialImageUrl={user?.avatarImageFileUrl} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit">
                {t('Save')}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Flex>
    </Flex>
  );
}

export default ProfilePage;
