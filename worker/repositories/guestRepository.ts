import type { GuestEntity, CreateGuestInput } from "../domain/guest";
import { generateId } from "../domain/token";

export interface GuestDbRow {
  id: string;
  invitation_id: string;
  name: string;
  guest_type: string;
  is_primary: number;
  is_named_guest: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function mapRowToGuest(row: GuestDbRow): GuestEntity {
  return {
    id: row.id,
    invitationId: row.invitation_id,
    name: row.name,
    guestType: row.guest_type as GuestEntity["guestType"],
    isPrimary: row.is_primary === 1,
    isNamedGuest: row.is_named_guest === 1,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class GuestRepository {
  constructor(private readonly db: D1Database) {}

  async listByInvitationId(invitationId: string): Promise<GuestEntity[]> {
    const { results } = await this.db
      .prepare("SELECT * FROM guests WHERE invitation_id = ? ORDER BY sort_order ASC, created_at ASC")
      .bind(invitationId)
      .all<GuestDbRow>();

    return (results ?? []).map(mapRowToGuest);
  }

  async create(input: CreateGuestInput): Promise<GuestEntity> {
    const id = generateId("gst");
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO guests (
          id, invitation_id, name, guest_type, is_primary, is_named_guest,
          sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        input.invitationId,
        input.name,
        input.guestType ?? "ADULT",
        input.isPrimary ? 1 : 0,
        input.isNamedGuest !== false ? 1 : 0,
        input.sortOrder ?? 0,
        now,
        now
      )
      .run();

    return {
      id,
      invitationId: input.invitationId,
      name: input.name,
      guestType: input.guestType ?? "ADULT",
      isPrimary: Boolean(input.isPrimary),
      isNamedGuest: input.isNamedGuest !== false,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    };
  }
}