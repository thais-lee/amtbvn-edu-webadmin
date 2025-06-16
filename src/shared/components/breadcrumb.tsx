import { HomeOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Link } from '@tanstack/react-router';
import { Breadcrumb } from 'antd';

import useApp from '@/hooks/use-app';

type TBreadcrumbProps = {
  items: {
    title: string;
    path?: string;
  }[];
};

const BreadcrumbComponent = ({ items }: TBreadcrumbProps) => {
  const { token } = useApp();

  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...items.map((item) => ({
      title: item.path ? <Link to={item.path}>{item.title}</Link> : item.title,
    })),
  ];

  return (
    <Breadcrumb
      items={breadcrumbItems}
      css={css`
        margin-bottom: ${token.margin}px;
      `}
    />
  );
};

export default BreadcrumbComponent;
