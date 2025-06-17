import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Col, Divider, Flex, Row, Skeleton, Typography } from 'antd';

import useApp from '@/hooks/use-app';
import dashboardService from '@/modules/dashboard/dashboard.service';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, token } = useApp();

  // Mock data for dashboard

  const dashboardQuery = useQuery({
    queryKey: ['/dashboard'],
    queryFn: () => dashboardService.getStats(),
    select: (data) => data.data,
  });

  const colors = [
    token.blue,
    token.green,
    token.orange,
    token.red,
    token.purple,
  ];
  const statKeys = [
    { label: 'Số lượng người dùng', value: dashboardQuery.data?.userCount },
    { label: 'Số lượng khóa học', value: dashboardQuery.data?.courseCount },
    { label: 'Số lượng bài học', value: dashboardQuery.data?.lessonCount },
    { label: 'Số lượng bài viết', value: dashboardQuery.data?.articleCount },
    {
      label: 'Số lượng tài liệu',
      value: dashboardQuery.data?.libraryMaterialCount,
    },
  ];

  return (
    <Flex vertical>
      <TitleHeading>{t('Dashboard')}</TitleHeading>

      <Divider />

      <Row gutter={[token.size, token.size]}>
        {statKeys.map((stat, index) => (
          <Col key={stat.label} span={6}>
            {dashboardQuery.isLoading ? (
              <Skeleton active />
            ) : (
              <Flex
                vertical
                css={css`
                  padding: ${token.padding}px;
                  padding-top: ${token.paddingXS}px;
                  background-color: ${colors[index]}25;
                  border-radius: ${token.borderRadius}px;
                `}
              >
                <Typography.Text
                  strong
                  css={css`
                    color: ${colors[index]};
                    font-size: ${token.fontSizeHeading5}px;
                  `}
                >
                  {t(stat.label as any)}
                </Typography.Text>

                <Typography.Text
                  strong
                  css={css`
                    font-size: ${token.fontSizeHeading3}px;
                    text-align: center;
                  `}
                >
                  {stat?.value?.toLocaleString() ?? '-'}
                </Typography.Text>
              </Flex>
            )}
          </Col>
        ))}
      </Row>
    </Flex>
  );
}
