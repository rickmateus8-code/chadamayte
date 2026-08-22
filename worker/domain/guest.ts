export type GuestType = "ADULT" | "CHILD" | "BABY";

export interface GuestEntity {
  id: string;
  invitationId: string;
  name: string;
  guestType: GuestType;
  isPrimary: boolean;
  isNamedGuest: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestInput {
  invitationId: string;
  name: string;
  guestType?: GuestType;
  isPrimary?: boolean;
  isNamedGuest?: boolean;
  sortOrder?: number;
}