import httpService from '@/shared/http-service';

import { TFile } from './file.model';

class FileService {
  uploadFile(formData: FormData) {
    return httpService.request<TFile>({
      url: '/api/files/upload',
      method: 'POST',
      contentType: 'multipart/form-data',
      data: formData,
    });
  }

  getFileUrl(fileId: number) {
    return httpService.request<string>({
      url: `/api/files/${fileId}/url`,
      method: 'GET',
    });
  }

  uploadRecordFile(formData: FormData) {
    return httpService.request<TFile>({
      url: '/api/files/upload-record',
      method: 'POST',
      contentType: 'multipart/form-data',
      data: formData,
    });
  }

  deleteFile(fileId: number) {
    return httpService.request<void>({
      url: `/api/files/${fileId}`,
      method: 'DELETE',
    });
  }
}

export default new FileService();
