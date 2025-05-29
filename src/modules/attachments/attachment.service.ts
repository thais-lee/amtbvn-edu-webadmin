import httpService from '@/shared/http-service';

import { TAttachment } from './attachment.model';
import { TCreateAttachment, TUpdateAttachment } from './dto/attachment.dto';

class AttachmentService {
  getAttachments = async (): Promise<TAttachment[]> => {
    const response = await httpService.request<TAttachment[]>({
      url: '/attachments',
      method: 'GET',
    });
    return response.data;
  };

  getAttachment = async (id: number): Promise<TAttachment> => {
    const response = await httpService.request<TAttachment>({
      url: `/attachments/${id}`,
      method: 'GET',
    });
    return response.data;
  };

  createAttachment = async (
    attachment: TCreateAttachment,
  ): Promise<TAttachment> => {
    const response = await httpService.request<TAttachment>({
      url: '/attachments',
      method: 'POST',
      data: attachment,
    });
    return response.data;
  };

  updateAttachment = async (
    id: number,
    attachment: TUpdateAttachment,
  ): Promise<TAttachment> => {
    const response = await httpService.request<TAttachment>({
      url: `/attachments/${id}`,
      method: 'PUT',
      data: attachment,
    });

    return response.data;
  };

  deleteAttachment = async (id: number): Promise<void> => {
    await httpService.request<void>({
      url: `/attachments/${id}`,
      method: 'DELETE',
    });
  };
}

export default new AttachmentService();
