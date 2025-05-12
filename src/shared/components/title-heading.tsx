import { css } from '@emotion/react';
import { Typography } from 'antd';

import useApp from '@/hooks/use-app';

const TitleHeading = ({ children }: { children: string }) => {
  const { token } = useApp();

  return (
    <Typography.Text
      strong
      css={css`
        font-size: ${token.fontSizeHeading3}px;
      `}
    >
      {children}
    </Typography.Text>
  );
};

export default TitleHeading;
