import { Tag } from 'antd';

import { EEnrollmentStatus } from '../dto/enrollment.dto';

export const EnrollmentStatusTag = ({
  status,
}: {
  status: EEnrollmentStatus;
}) => {
  return (
    <Tag
      color={
        status === EEnrollmentStatus.PENDING
          ? 'blue'
          : status === EEnrollmentStatus.ACCEPTED
            ? 'green'
            : status === EEnrollmentStatus.REJECTED
              ? 'red'
              : 'gray'
      }
    >
      {status}
    </Tag>
  );
};
