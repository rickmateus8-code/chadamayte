export type UploadType = "GUEST_PHOTO" | "EVENT_ASSET" | "LOGO" | "GALLERY";

export type MediaStatus = "PENDING" | "AVAILABLE" | "REJECTED" | "DELETED";

export interface MediaUploadEntity {
  id: string;
  eventId: string;
  invitationId?: string | null;
  r2Key: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  uploadType: UploadType;
  status: MediaStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterMediaInput {
  eventId: string;
  invitationId?: string;
  r2Key: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  uploadType: UploadType;
}