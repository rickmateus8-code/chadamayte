export type EventType = "BABY_SHOWER" | "DIAPER_SHOWER" | "BIRTHDAY" | "OTHER";

export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface EventEntity {
  id: string;
  slug: string;
  name: string;
  babyName: string;
  eventType: EventType;
  status: EventStatus;
  eventDate: string; // ISO 8601 string
  timezone: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venuePostalCode?: string | null;
  mapUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  slug: string;
  name: string;
  babyName: string;
  eventType?: EventType;
  eventDate: string;
  timezone?: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venuePostalCode?: string;
  mapUrl?: string;
}