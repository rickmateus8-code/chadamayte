import type { InvitationEntity, CreateInvitationInput } from "../domain/invitation";
import { generateId, generateInvitationToken } from "../domain/token";

export interface InvitationDbRow {
  id: string;
  event_id: string;
  display_name: string;
  salutation: string | null;
  public_token: string;
  status: string;
  allow_additional_guests: number;
  max_additional_guests: number;
  notes_internal: string | null;
  created_at: string;
  updated_at: string;
  revoked_at: string | null;
}

function mapRowToInvitation(row: InvitationDbRow): InvitationEntity {
  return {
    id: row.id,
    eventId: row.event_id,
    displayName: row.display_name,
    salutation: row.salutation,
    publicToken: row.public_token,
    status: row.status as InvitationEntity["status"],
    allowAdditionalGuests: row.allow_additional_guests === 1,
    maxAdditionalGuests: row.max_additional_guests,
    notesInternal: row.notes_internal,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    revokedAt: row.revoked_at,
  };
}

export class InvitationRepository {
  constructor(private readonly db: D1Database) {}

  async findByToken(token: string): Promise<InvitationEntity | null> {
    const row = await this.db
      .prepare("SELECT * FROM invitations WHERE public_token = ? LIMIT 1")
      .bind(token)
      .first<InvitationDbRow>();

    return row ? mapRowToInvitation(row) : null;
  }

  async findById(id: string): Promise<InvitationEntity | null> {
    const row = await this.db
      .prepare("SELECT * FROM invitations WHERE id = ? LIMIT 1")
      .bind(id)
      .first<InvitationDbRow>();

    return row ? mapRowToInvitation(row) : null;
  }

  async listByEventId(eventId: string): Promise<InvitationEntity[]> {
    const { results } = await this.db
      .prepare("SELECT * FROM invitations WHERE event_id = ? ORDER BY created_at DESC")
      .bind(eventId)
      .all<InvitationDbRow>();

    return (results ?? []).map(mapRowToInvitation);
  }

  async create(input: CreateInvitationInput): Promise<InvitationEntity> {
    const id = generateId("inv");
    const publicToken = generateInvitationToken();
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO invitations (
          id, event_id, display_name, salutation, public_token, status,
          allow_additional_guests, max_additional_guests, notes_internal,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        input.eventId,
        input.displayName,
        input.salutation ?? null,
        publicToken,
        "ACTIVE",
        input.allowAdditionalGuests ? 1 : 0,
        input.maxAdditionalGuests ?? 0,
        input.notesInternal ?? null,
        now,
        now
      )
      .run();

    return {
      id,
      eventId: input.eventId,
      displayName: input.displayName,
      salutation: input.salutation ?? null,
      publicToken,
      status: "ACTIVE",
      allowAdditionalGuests: Boolean(input.allowAdditionalGuests),
      maxAdditionalGuests: input.maxAdditionalGuests ?? 0,
      notesInternal: input.notesInternal ?? null,
      createdAt: now,
      updatedAt: now,
    };
  }
}