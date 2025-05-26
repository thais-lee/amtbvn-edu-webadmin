import { useQuery } from '@tanstack/react-query';
import { Drawer, Image, Skeleton, Typography } from 'antd';

import useApp from '@/hooks/use-app';
import articleService from '@/modules/articles/article.service';

interface ArticlePreviewDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
}

const ArticlePreviewDrawer = ({
  open,
  setOpen,
  id,
}: ArticlePreviewDrawerProps) => {
  const { t } = useApp();

  const { data: article, isLoading } = useQuery({
    queryKey: ['/articles', id],
    queryFn: () => articleService.getOne(id),
    enabled: !!id,
  });

  return (
    <Drawer
      title={t('Article Info')}
      width={720}
      onClose={() => setOpen(false)}
      open={open}
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div>
          <Typography.Title level={4}>{article?.data.title}</Typography.Title>
          <div
            dangerouslySetInnerHTML={{ __html: article?.data.content || '' }}
          />
          <div>
            <Typography.Text strong>{t('Category')}: </Typography.Text>
            <Typography.Text>{article?.data.category.name}</Typography.Text>
          </div>
          <div>
            <Typography.Text strong>{t('Image')}: </Typography.Text>
            <Image
              src={article?.data.thumbnailUrl}
              alt="Thumbnail"
              width={200}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <Typography.Text strong>{t('Type')}: </Typography.Text>
            <Typography.Text>{article?.data.type}</Typography.Text>
          </div>
          <div>
            <Typography.Text strong>{t('Status')}: </Typography.Text>
            <Typography.Text>{article?.data.status}</Typography.Text>
          </div>
          <div>
            <Typography.Text strong>{t('Views')}: </Typography.Text>
            <Typography.Text>{article?.data.viewCount}</Typography.Text>
          </div>
          <div>
            <Typography.Text strong>{t('Likes')}: </Typography.Text>
            <Typography.Text>{article?.data.likeCount}</Typography.Text>
          </div>
          <div>
            <Typography.Text strong>{t('Created by')}: </Typography.Text>
            <Typography.Text>
              {article?.data.user.firstName} {article?.data.user.lastName}
            </Typography.Text>
          </div>
          <div>
            <Typography.Text strong>{t('Created at')}: </Typography.Text>
            <Typography.Text>
              {new Date(article?.data.createdAt || '').toLocaleString()}
            </Typography.Text>
          </div>
          <div>
            <Typography.Text strong>{t('Updated at')}: </Typography.Text>
            <Typography.Text>
              {new Date(article?.data.updatedAt || '').toLocaleString()}
            </Typography.Text>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default ArticlePreviewDrawer;
