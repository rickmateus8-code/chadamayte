import type { EventEntity, CreateEventInput } from "../domain/event";
import { generateId } from "../domain/token";

export interface EventDbRow {
  id: string;
  slug: string;
  name: string;
  baby_name: string;
  event_type: string;
  status: string;
  event_date: string;
  timezone: string;
  venue_name: string;
  venue_address: string;
  venue_city: string;
  venue_state: string;
  venue_postal_code: string | null;
  map_url: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToEvent(row: EventDbRow): EventEntity {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    babyName: row.baby_name,
    eventType: row.event_type as EventEntity["eventType"],
    status: row.status as EventEntity["status"],
    eventDate: row.event_date,
    timezone: row.timezone,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    venueCity: row.venue_city,
    venueState: row.venue_state,
    venuePostalCode: row.venue_postal_code,
    mapUrl: row.map_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class EventRepository {
  constructor(private readonly db: D1Database) {}

  async findBySlug(slug: string): Promise<EventEntity | null> {
    const row = await this.db
      .prepare("SELECT * FROM events WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first<EventDbRow>();

    return row ? mapRowToEvent(row) : null;
  }

  async findById(id: string): Promise<EventEntity | null> {
    const row = await this.db
      .prepare("SELECT * FROM events WHERE id = ? LIMIT 1")
      .bind(id)
      .first<EventDbRow>();

    return row ? mapRowToEvent(row) : null;
  }

  async create(input: CreateEventInput): Promise<EventEntity> {
    const id = generateId("evt");
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO events (
          id, slug, name, baby_name, event_type, status, event_date, timezone,
          venue_name, venue_address, venue_city, venue_state, venue_postal_code,
          map_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        input.slug,
        input.name,
        input.babyName,
        input.eventType ?? "DIAPER_SHOWER",
        "DRAFT",
        input.eventDate,
        input.timezone ?? "America/Sao_Paulo",
        input.venueName,
        input.venueAddress,
        input.venueCity,
        input.venueState,
        input.venuePostalCode ?? null,
        input.mapUrl ?? null,
        now,
        now
      )
      .run();

    return {
      id,
      slug: input.slug,
      name: input.name,
      babyName: input.babyName,
      eventType: input.eventType ?? "DIAPER_SHOWER",
      status: "DRAFT",
      eventDate: input.eventDate,
      timezone: input.timezone ?? "America/Sao_Paulo",
      venueName: input.venueName,
      venueAddress: input.venueAddress,
      venueCity: input.venueCity,
      venueState: input.venueState,
      venuePostalCode: input.venuePostalCode ?? null,
      mapUrl: input.mapUrl ?? null,
      createdAt: now,
      updatedAt: now,
    };
  }
}