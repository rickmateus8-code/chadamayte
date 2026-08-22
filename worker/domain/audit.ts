export type ActorType = "ADMIN" | "GUEST" | "SYSTEM";

export interface AuditLogEntity {
  id: string;
  eventId?: string | null;
  actorType: ActorType;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadataJson?: string | null;
  createdAt: string;
}

export interface RecordAuditInput {
  eventId?: string;
  actorType: ActorType;
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}