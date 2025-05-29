export interface TFile {
  id: number;
  fileName: string;
  description?: string;
  storagePath: string;
  mimeType: string;
  size: number;
  uploadedBy: number;
  createdAt: Date;
  updatedAt: Date;
}
