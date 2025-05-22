import { Tag } from 'antd';
import { useMemo } from 'react';

import { EUserRole } from '@/modules/users/user.model';

const UserRoleTag = ({ role }: { role: EUserRole }) => {
  const color = useMemo<string>(() => {
    switch (role) {
      case EUserRole.ADMIN:
        return 'blue';
      case EUserRole.USER:
        return 'green';
      default:
        return 'default';
    }
  }, [role]);

  return <Tag color={color}>{role}</Tag>;
};

export default UserRoleTag;
