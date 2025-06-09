import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
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
  maxSize = 10,
  folder = 'files',
  description = '',
}: UploadFileComponentProps) {
  const { t } = useApp();
  const [fileList, setFileList] = useState<UploadFile[]>(
    initialFiles.map((file) => ({
      uid: file.id.toString(),
      name: file.fileName,
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

  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const formData = new FormData();
      formData.append('file', file as File);
      formData.append('folder', folder);
      formData.append('description', description);
      const response = await fileService.uploadRecordFile(formData);
      onSuccess?.({ id: response.data.id });
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const handleRemove: UploadProps['onRemove'] = async (file) => {
    // Try to get the id from response, uid, or id
    const fileId =
      (file.response && file.response.id) ||
      (file.uid && !isNaN(Number(file.uid)) ? Number(file.uid) : undefined) ||
      (file as any).id;
    if (fileId) {
      await fileService.deleteFile(fileId);
    } else {
      message.error('Could not determine file id for deletion');
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
