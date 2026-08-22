import type { SubmitRsvpInput, RsvpEntity, RsvpMemberEntity } from "../domain/rsvp";
import { RsvpRepository } from "../repositories/rsvpRepository";
import { InvitationRepository } from "../repositories/invitationRepository";
import { GuestRepository } from "../repositories/guestRepository";
import { AuditRepository } from "../repositories/auditRepository";

export class RsvpService {
  private readonly rsvpRepo: RsvpRepository;
  private readonly invitationRepo: InvitationRepository;
  private readonly guestRepo: GuestRepository;
  private readonly auditRepo: AuditRepository;

  constructor(db: D1Database) {
    this.rsvpRepo = new RsvpRepository(db);
    this.invitationRepo = new InvitationRepository(db);
    this.guestRepo = new GuestRepository(db);
    this.auditRepo = new AuditRepository(db);
  }

  async processRsvp(input: SubmitRsvpInput): Promise<{ rsvp: RsvpEntity; members: RsvpMemberEntity[] }> {
    const invitation = await this.invitationRepo.findById(input.invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "ACTIVE") {
      throw new Error("Invitation is not active");
    }

    // Validate additional guests limit
    const additionalMembers = input.members.filter((m) => m.isAdditionalGuest);
    if (additionalMembers.length > 0) {
      if (!invitation.allowAdditionalGuests) {
        throw new Error("Additional guests are not permitted for this invitation.");
      }
      if (additionalMembers.length > invitation.maxAdditionalGuests) {
        throw new Error(
          `Maximum additional guests exceeded. Allowed: ${invitation.maxAdditionalGuests}, provided: ${additionalMembers.length}`
        );
      }
    }

    // Validate nominal guests ownership
    const validGuests = await this.guestRepo.listByInvitationId(invitation.id);
    const validGuestIds = new Set(validGuests.map((g) => g.id));

    for (const member of input.members) {
      if (member.guestId && !validGuestIds.has(member.guestId)) {
        throw new Error(`Guest with ID ${member.guestId} does not belong to this invitation.`);
      }
    }

    const result = await this.rsvpRepo.upsert(input);

    await this.auditRepo.log({
      eventId: invitation.eventId,
      actorType: "GUEST",
      action: "RSVP_SUBMITTED",
      entityType: "RSVP",
      entityId: result.rsvp.id,
      metadata: {
        invitationId: invitation.id,
        status: result.rsvp.status,
        guestCount: result.rsvp.guestCount,
      },
    });

    return result;
  }
}