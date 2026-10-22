import type { PortalDynamicConfig } from "../config/portalConfig";

export interface AdminOverview {
  totalInvitations: number;
  totalNominalGuests: number;
  confirmedInvitations: number;
  declinedInvitations: number;
  pendingInvitations: number;
  confirmedAdults: number;
  confirmedChildren: number;
  totalConfirmedPeople: number;
  totalPhotos: number;
}

export interface AdminGuest {
  id: string;
  name: string;
  guest_type: string;
  is_primary: number;
  sort_order: number;
}

export interface AdminInvitation {
  id: string;
  display_name: string;
  salutation: string | null;
  public_token: string;
  status: string;
  allow_additional_guests: number;
  max_additional_guests: number;
  rsvp_status: string | null;
  rsvp_contact_name: string | null;
  rsvp_guest_count: number | null;
  rsvp_submitted_at: string | null;
  guests: AdminGuest[];
}

export interface AdminRsvpMember {
  id: string;
  display_name: string;
  attendance_status: string;
  is_additional_guest: number;
  guest_type: string;
}

export interface AdminRsvp {
  id: string;
  invitation_id: string;
  invitation_name: string;
  public_token: string;
  status: string;
  contact_name: string;
  contact_whatsapp: string | null;
  guest_count: number;
  additional_guest_count: number;
  notes: string | null;
  submitted_at: string;
  members: AdminRsvpMember[];
}

export interface AdminMedia {
  id: string;
  r2_key: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  status: string;
  created_at: string;
}

export interface AdminEventSettings {
  targetDate: string;
  dateFormatted: string;
  timeFormatted: string;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationState: string;
  mapUrl: string;
  pixKey: string;
  pixBeneficiary: string;
  observations: string;
  portalConfig?: Partial<PortalDynamicConfig> | null;
}

function getHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function adminLogin(
  credentials: { email?: string; password?: string; passcode?: string } | string
): Promise<{ success: boolean; token?: string; message?: string }> {
  try {
    const payload = typeof credentials === "string" ? { passcode: credentials } : credentials;
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Erro de conexão com o servidor." };
  }
}

export async function approveAdminMedia(token: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/media/${id}/approve`, {
      method: "POST",
      headers: getHeaders(token),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminOverview(token: string): Promise<AdminOverview | null> {
  try {
    const res = await fetch("/api/admin/overview", {
      headers: getHeaders(token),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAdminInvitations(token: string): Promise<AdminInvitation[]> {
  try {
    const res = await fetch("/api/admin/invitations", {
      headers: getHeaders(token),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function createAdminInvitation(
  token: string,
  payload: {
    displayName: string;
    salutation?: string;
    guestNames: string[];
    allowAdditionalGuests: boolean;
    maxAdditionalGuests: number;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/admin/invitations", {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Erro ao criar convite." };
  }
}

export async function updateAdminInvitationStatus(
  token: string,
  id: string,
  targetStatus: "PENDING" | "CONFIRMED" | "DECLINED"
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/admin/invitations/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify({ targetStatus }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Erro ao mover cartão no quadro." };
  }
}

export async function deleteAdminInvitation(token: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/invitations/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminRsvps(token: string): Promise<AdminRsvp[]> {
  try {
    const res = await fetch("/api/admin/rsvps", {
      headers: getHeaders(token),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAdminMedia(token: string): Promise<AdminMedia[]> {
  try {
    const res = await fetch("/api/admin/media", {
      headers: getHeaders(token),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function deleteAdminMedia(token: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/media/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminEventSettings(token: string): Promise<AdminEventSettings | null> {
  try {
    const res = await fetch("/api/admin/event-settings", {
      headers: getHeaders(token),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateAdminEventSettings(
  token: string,
  payload: Partial<AdminEventSettings>
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/admin/event-settings", {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Erro ao salvar configurações." };
  }
}
