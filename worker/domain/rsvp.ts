import type { GuestType } from "./guest";

export type RsvpStatus = "PENDING" | "CONFIRMED" | "DECLINED" | "PARTIAL";

export type AttendanceStatus = "CONFIRMED" | "DECLINED";

export interface RsvpEntity {
  id: string;
  invitationId: string;
  status: RsvpStatus;
  contactName: string;
  contactWhatsapp?: string | null;
  guestCount: number;
  additionalGuestCount: number;
  notes?: string | null;
  submittedAt: string;
  updatedAt: string;
}

export interface RsvpMemberEntity {
  id: string;
  rsvpId: string;
  guestId?: string | null;
  displayName: string;
  attendanceStatus: AttendanceStatus;
  isAdditionalGuest: boolean;
  guestType: GuestType;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitRsvpInput {
  invitationId: string;
  contactName: string;
  contactWhatsapp?: string;
  notes?: string;
  members: Array<{
    guestId?: string;
    displayName: string;
    attendanceStatus: AttendanceStatus;
    isAdditionalGuest?: boolean;
    guestType?: GuestType;
  }>;
}