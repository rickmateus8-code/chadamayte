import type { AuditLogEntity, RecordAuditInput } from "../domain/audit";
import { generateId } from "../domain/token";

export class AuditRepository {
  constructor(private readonly db: D1Database) {}

  async log(input: RecordAuditInput): Promise<AuditLogEntity> {
    const id = generateId("aud");
    const now = new Date().toISOString();
    const metadataJson = input.metadata ? JSON.stringify(input.metadata) : null;

    await this.db
      .prepare(`
        INSERT INTO audit_logs (
          id, event_id, actor_type, actor_id, action,
          entity_type, entity_id, metadata_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        input.eventId ?? null,
        input.actorType,
        input.actorId ?? null,
        input.action,
        input.entityType,
        input.entityId ?? null,
        metadataJson,
        now
      )
      .run();

    return {
      id,
      eventId: input.eventId ?? null,
      actorType: input.actorType,
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadataJson,
      createdAt: now,
    };
  }
}