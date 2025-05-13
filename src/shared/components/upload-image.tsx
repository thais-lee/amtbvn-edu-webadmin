import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';

const dummyRequest = ({ onSuccess }: any) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

type TUploadImageProps = {
  initialImageUrl?: string;
  onUpload: (file: Blob) => Promise<string | void>;
  onUploadSuccess?: (imageUrl?: string) => void;
};

const UploadImage = ({
  initialImageUrl,
  onUpload,
  onUploadSuccess,
}: TUploadImageProps) => {
  const { t } = useApp();

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const mutation = useMutation({
    mutationFn: (file: Blob) => {
      return onUpload(file);
    },
    onSuccess: (data) => {
      if (data) {
        setImageUrl(data);
      }
      onUploadSuccess?.(data || undefined);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleChange = useMemo<UploadProps['onChange']>(
    () => async (info: UploadChangeParam<UploadFile>) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
      } else if (info.file.status === 'done') {
        setLoading(false);
        await mutation.mutateAsync(info.file.originFileObj as RcFile);
      }
    },
    [mutation],
  );

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadButton = (
    <button
      css={css`
        border: 0;
        background: none;
      `}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        css={css`
          margin-top: 8px;
        `}
      >
        {t('Upload')}
      </div>
    </button>
  );

  return (
    <ImgCrop rotationSlider showGrid showReset resetText={t('Reset')}>
      <Upload
        name="image"
        listType="picture-card"
        className="avatar-uploader"
        customRequest={(options) => dummyRequest(options)}
        showUploadList={false}
        onChange={handleChange}
        onPreview={onPreview}
      >
        {!loading && imageUrl ? (
          <img
            src={imageUrl}
            alt="image"
            css={css`
              width: 100%;
            `}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
};

export default UploadImage;
