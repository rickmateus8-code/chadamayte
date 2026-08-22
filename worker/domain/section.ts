export type EventSectionKey =
  | "hero"
  | "welcome"
  | "event_details"
  | "countdown"
  | "rsvp"
  | "memories"
  | "gifts"
  | "closing";

export interface EventSectionEntity {
  id: string;
  eventId: string;
  sectionKey: string;
  enabled: boolean;
  sortOrder: number;
  configJson?: string | null;
  createdAt: string;
  updatedAt: string;
}