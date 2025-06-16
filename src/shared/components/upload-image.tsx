// src/shared/components/upload-image.tsx
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';

const dummyRequest = ({ onSuccess }: any) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

type TUploadImageProps = {
  initialImageUrl?: string;
  onFileSelect?: (file: File | null) => void; // New prop for handling file selection
  aspectRatio?: number; // Optional aspect ratio for cropping
};

const UploadImage = ({
  initialImageUrl,
  onFileSelect,
  aspectRatio,
}: TUploadImageProps) => {
  const { t } = useApp();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleChange = useMemo<UploadProps['onChange']>(
    () => async (info: UploadChangeParam<UploadFile>) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }

      if (info.file.status === 'done') {
        const file = info.file.originFileObj as RcFile;

        // Create preview URL
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImageUrl(reader.result as string);
          setLoading(false);
        };

        // Pass the file to parent component
        onFileSelect?.(file);
      }
    },
    [onFileSelect],
  );

  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

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
    <ImgCrop
      rotationSlider
      showGrid
      showReset
      resetText={t('Reset')}
      aspect={aspectRatio}
      modalProps={{
        destroyOnHidden: true,
      }}
    >
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
              height: 100%;
              object-fit: cover;
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
