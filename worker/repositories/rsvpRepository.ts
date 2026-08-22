import type { RsvpEntity, RsvpMemberEntity, SubmitRsvpInput, RsvpStatus } from "../domain/rsvp";
import { generateId } from "../domain/token";

export interface RsvpDbRow {
  id: string;
  invitation_id: string;
  status: string;
  contact_name: string;
  contact_whatsapp: string | null;
  guest_count: number;
  additional_guest_count: number;
  notes: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface RsvpMemberDbRow {
  id: string;
  rsvp_id: string;
  guest_id: string | null;
  display_name: string;
  attendance_status: string;
  is_additional_guest: number;
  guest_type: string;
  created_at: string;
  updated_at: string;
}

function mapRowToRsvp(row: RsvpDbRow): RsvpEntity {
  return {
    id: row.id,
    invitationId: row.invitation_id,
    status: row.status as RsvpEntity["status"],
    contactName: row.contact_name,
    contactWhatsapp: row.contact_whatsapp,
    guestCount: row.guest_count,
    additionalGuestCount: row.additional_guest_count,
    notes: row.notes,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
  };
}

function mapRowToMember(row: RsvpMemberDbRow): RsvpMemberEntity {
  return {
    id: row.id,
    rsvpId: row.rsvp_id,
    guestId: row.guest_id,
    displayName: row.display_name,
    attendanceStatus: row.attendance_status as RsvpMemberEntity["attendanceStatus"],
    isAdditionalGuest: row.is_additional_guest === 1,
    guestType: row.guest_type as RsvpMemberEntity["guestType"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class RsvpRepository {
  constructor(private readonly db: D1Database) {}

  async findByInvitationId(invitationId: string): Promise<{ rsvp: RsvpEntity; members: RsvpMemberEntity[] } | null> {
    const rsvpRow = await this.db
      .prepare("SELECT * FROM rsvps WHERE invitation_id = ? LIMIT 1")
      .bind(invitationId)
      .first<RsvpDbRow>();

    if (!rsvpRow) return null;

    const { results: memberRows } = await this.db
      .prepare("SELECT * FROM rsvp_members WHERE rsvp_id = ? ORDER BY created_at ASC")
      .bind(rsvpRow.id)
      .all<RsvpMemberDbRow>();

    return {
      rsvp: mapRowToRsvp(rsvpRow),
      members: (memberRows ?? []).map(mapRowToMember),
    };
  }

  async upsert(input: SubmitRsvpInput): Promise<{ rsvp: RsvpEntity; members: RsvpMemberEntity[] }> {
    const existing = await this.findByInvitationId(input.invitationId);
    const rsvpId = existing?.rsvp.id ?? generateId("rsvp");
    const now = new Date().toISOString();

    const confirmedCount = input.members.filter((m) => m.attendanceStatus === "CONFIRMED").length;
    const additionalCount = input.members.filter((m) => m.isAdditionalGuest && m.attendanceStatus === "CONFIRMED").length;

    let computedStatus: RsvpStatus = "DECLINED";
    if (confirmedCount > 0) {
      computedStatus = confirmedCount === input.members.length ? "CONFIRMED" : "PARTIAL";
    }

    const statements: D1PreparedStatement[] = [];

    // 1. Upsert RSVP Header
    statements.push(
      this.db
        .prepare(`
          INSERT INTO rsvps (
            id, invitation_id, status, contact_name, contact_whatsapp,
            guest_count, additional_guest_count, notes, submitted_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(invitation_id) DO UPDATE SET
            status = excluded.status,
            contact_name = excluded.contact_name,
            contact_whatsapp = excluded.contact_whatsapp,
            guest_count = excluded.guest_count,
            additional_guest_count = excluded.additional_guest_count,
            notes = excluded.notes,
            updated_at = excluded.updated_at
        `)
        .bind(
          rsvpId,
          input.invitationId,
          computedStatus,
          input.contactName,
          input.contactWhatsapp ?? null,
          confirmedCount,
          additionalCount,
          input.notes ?? null,
          existing ? existing.rsvp.submittedAt : now,
          now
        )
    );

    // 2. Clear old members on update
    if (existing) {
      statements.push(
        this.db.prepare("DELETE FROM rsvp_members WHERE rsvp_id = ?").bind(rsvpId)
      );
    }

    // 3. Insert fresh members
    for (const member of input.members) {
      const memberId = generateId("rmb");
      statements.push(
        this.db
          .prepare(`
            INSERT INTO rsvp_members (
              id, rsvp_id, guest_id, display_name, attendance_status,
              is_additional_guest, guest_type, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            memberId,
            rsvpId,
            member.guestId ?? null,
            member.displayName,
            member.attendanceStatus,
            member.isAdditionalGuest ? 1 : 0,
            member.guestType ?? "ADULT",
            now,
            now
          )
      );
    }

    await this.db.batch(statements);

    return (await this.findByInvitationId(input.invitationId))!;
  }
}