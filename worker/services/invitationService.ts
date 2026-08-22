import type { InvitationEntity } from "../domain/invitation";
import type { GuestEntity } from "../domain/guest";
import type { RsvpEntity, RsvpMemberEntity } from "../domain/rsvp";
import { InvitationRepository } from "../repositories/invitationRepository";
import { GuestRepository } from "../repositories/guestRepository";
import { RsvpRepository } from "../repositories/rsvpRepository";

export interface InvitationDetails {
  invitation: InvitationEntity;
  guests: GuestEntity[];
  rsvp: {
    data: RsvpEntity;
    members: RsvpMemberEntity[];
  } | null;
}

export class InvitationService {
  private readonly invitationRepo: InvitationRepository;
  private readonly guestRepo: GuestRepository;
  private readonly rsvpRepo: RsvpRepository;

  constructor(db: D1Database) {
    this.invitationRepo = new InvitationRepository(db);
    this.guestRepo = new GuestRepository(db);
    this.rsvpRepo = new RsvpRepository(db);
  }

  async getByToken(token: string): Promise<InvitationDetails | null> {
    const invitation = await this.invitationRepo.findByToken(token);
    if (!invitation || invitation.status !== "ACTIVE") {
      return null;
    }

    const guests = await this.guestRepo.listByInvitationId(invitation.id);
    const rsvpData = await this.rsvpRepo.findByInvitationId(invitation.id);

    return {
      invitation,
      guests,
      rsvp: rsvpData ? { data: rsvpData.rsvp, members: rsvpData.members } : null,
    };
  }

  async createInvitationWithGuests(
    eventId: string,
    displayName: string,
    salutation?: string,
    guestNames: string[] = [],
    allowAdditionalGuests = false,
    maxAdditionalGuests = 0
  ): Promise<{ invitation: InvitationEntity; guests: GuestEntity[] }> {
    const invitation = await this.invitationRepo.create({
      eventId,
      displayName,
      salutation,
      allowAdditionalGuests,
      maxAdditionalGuests,
    });

    const guests: GuestEntity[] = [];
    for (let i = 0; i < guestNames.length; i++) {
      const guest = await this.guestRepo.create({
        invitationId: invitation.id,
        name: guestNames[i],
        isPrimary: i === 0,
        sortOrder: i,
      });
      guests.push(guest);
    }

    return { invitation, guests };
  }
}