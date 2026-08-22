export type InvitationStatus = "DRAFT" | "ACTIVE" | "REVOKED" | "EXPIRED";

export interface InvitationEntity {
  id: string;
  eventId: string;
  displayName: string;
  salutation?: string | null;
  publicToken: string;
  status: InvitationStatus;
  allowAdditionalGuests: boolean;
  maxAdditionalGuests: number;
  notesInternal?: string | null;
  createdAt: string;
  updatedAt: string;
  revokedAt?: string | null;
}

export interface CreateInvitationInput {
  eventId: string;
  displayName: string;
  salutation?: string;
  allowAdditionalGuests?: boolean;
  maxAdditionalGuests?: number;
  notesInternal?: string;
}