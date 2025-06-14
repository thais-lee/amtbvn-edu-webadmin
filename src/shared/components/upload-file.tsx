import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import fileService from '@/modules/files/file.service';

interface UploadFileComponentProps {
  onFileSelect: (fileIds: number[]) => void;
  initialFiles?: { id: number; fileName: string; url: string }[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  folder?: string;
  description?: string;
}

export default function UploadFileComponent({
  onFileSelect,
  initialFiles = [],
  multiple = false,
  accept = '*',
  maxSize = 1000000,
  folder = 'files',
  description = '',
}: UploadFileComponentProps) {
  const { t } = useApp();
  const [fileList, setFileList] = useState<UploadFile[]>(
    initialFiles.map((file) => ({
      uid: file.id.toString(),
      name: file.fileName.normalize('NFC'),
      status: 'done',
      url: file.url,
      response: { id: file.id },
    })),
  );

  const handleChange: UploadProps['onChange'] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    // Get IDs of uploaded files
    const uploadedIds = newFileList
      .filter(
        (file) => file.status === 'done' && file.response && file.response.id,
      )
      .map((file) => file.response.id as number);
    onFileSelect(uploadedIds);
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`File must be smaller than ${maxSize}MB!`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const customRequest: UploadProps['customRequest'] = async (
    options: UploadRequestOption,
  ) => {
    try {
      const file = options.file as File;
      const normalizedFile = new File([file], file.name.normalize('NFC'), {
        type: file.type,
      });
      const formData = new FormData();
      formData.append('file', normalizedFile);
      formData.append('folder', folder);
      formData.append('description', description);
      const response = await fileService.uploadRecordFile(formData);
      options.onSuccess?.({ id: response.data.id } as any, normalizedFile);
    } catch (error) {
      options.onError?.(error as Error);
    }
  };

  const removeMutation = useMutation({
    mutationFn: (fileId: number) => fileService.deleteFile(fileId),
    onSuccess: () => {
      message.success(t('File deleted successfully'));
    },
    onError: () => {
      message.error(t('Failed to delete file'));
    },
  });

  const handleRemove: UploadProps['onRemove'] = async (file) => {
    // Try to get the id from response, uid, or id
    const fileId =
      (file.response && file.response.id) ||
      (file.uid && !isNaN(Number(file.uid)) ? Number(file.uid) : undefined) ||
      (file as any).id;
    if (fileId) {
      await removeMutation.mutateAsync(fileId);
    } else {
      message.error(t('Could not determine file id for deletion'));
    }
  };

  return (
    <Upload
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      multiple={multiple}
      accept={accept}
      onRemove={handleRemove}
      listType="picture"
      showUploadList={{
        showRemoveIcon: true,
        removeIcon: <DeleteOutlined style={{ color: 'red' }} />,
      }}
    >
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
}
