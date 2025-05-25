import httpService from '@/shared/http-service';

class FileService {
  uploadImage(file: FormData) {
    return httpService.request({
      url: '/files/upload',
      method: 'POST',
      contentType: 'multipart/form-data',
      data: {
        file,
      },
    });
  }
}

export default new FileService();
