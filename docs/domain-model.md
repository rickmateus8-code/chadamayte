# Modelo de Domínio e Persistência D1 — Chá de Fraldas da Maytê

## 1. Visão Geral da Arquitetura

O sistema adota um modelo relacional robusto no Cloudflare D1 (SQLite) desacoplado da interface visual, projetado para suportar o ciclo completo de eventos, convites individuais/familiares, confirmação de presença (RSVP) granular, mídias e auditoria operacional.

```text
Event (1) ────┬───< Invitations (N) ───┬───< Guests (N)
              │                        │
              │                        └───< RSVPs (0..1) ───< RSVP Members (N)
              │
              ├───< Media Uploads (N)
              ├───< Event Sections (N)
              ├───< Event Settings (N)
              └───< Audit Logs (N)
```

---

## 2. Entidades Centrais e Cardinalidade

### A. Event (`events`)
Representa a instância comemorativa.
* **Chave Primária:** UUID (`evt_...`).
* **Campos:** `slug` (UNIQUE), `name`, `baby_name`, `event_type`, `status`, `event_date`, `timezone`, `venue_name`, `venue_address`, `venue_city`, `venue_state`, `venue_postal_code`, `map_url`, `created_at`, `updated_at`.
* **Status:** `DRAFT` | `PUBLISHED` | `ARCHIVED`.

### B. Invitation (`invitations`)
Representa a unidade de convite compartilhável (ex: "Família Oliveira", "Maria e João").
* **Chave Primária:** UUID (`inv_...`).
* **Relação:** `event_id` -> `events(id)` ON DELETE CASCADE.
* **Token Público:** `public_token` (UNIQUE, 24 caracteres base62 criptograficamente seguros gerados via Web Crypto, ~143 bits de entropia).
* **Campos:** `display_name`, `salutation`, `status`, `allow_additional_guests`, `max_additional_guests`, `notes_internal`, `created_at`, `updated_at`, `revoked_at`.
* **Status:** `DRAFT` | `ACTIVE` | `REVOKED` | `EXPIRED`.
* **Distinção Fundamental:** `Invitation.status` controla o ciclo de vida do convite (acesso/expiração/revogação), enquanto `Rsvp.status` reflete a resposta de presença dos convidados.

### C. Guest (`guests`)
Representa cada indivíduo humano nominal previamente vinculado ao convite.
* **Chave Primária:** UUID (`gst_...`).
* **Relação:** `invitation_id` -> `invitations(id)` ON DELETE CASCADE.
* **Campos:** `name`, `guest_type` (`ADULT` | `CHILD` | `BABY`), `is_primary` (0/1), `is_named_guest` (0/1), `sort_order`, timestamps.

### D. RSVP (`rsvps`)
Representa a submissão agregada de confirmação do convite (no máximo 1 por convite).
* **Chave Primária:** UUID (`rsvp_...`).
* **Relação:** `invitation_id` -> `invitations(id)` ON DELETE CASCADE (com `CONSTRAINT uq_rsvps_invitation UNIQUE (invitation_id)`).
* **Campos:** `status`, `contact_name`, `contact_whatsapp`, `guest_count`, `additional_guest_count`, `notes`, `submitted_at`, `updated_at`.
* **Status:** `PENDING` | `CONFIRMED` | `DECLINED` | `PARTIAL`.
  * `PENDING`: Nenhuma submissão ativa.
  * `CONFIRMED`: Todos os convidados do grupo confirmaram presença.
  * `DECLINED`: Convite integralmente recusado.
  * `PARTIAL`: Parte do grupo confirmou e parte recusou.

### E. RSVP Member (`rsvp_members`)
Representa a decisão individual de presença de cada participante (nominal ou acompanhante extra).
* **Chave Primária:** UUID (`rmb_...`).
* **Relações:**
  * `rsvp_id` -> `rsvps(id)` ON DELETE CASCADE.
  * `guest_id` -> `guests(id)` ON DELETE SET NULL (preserva o histórico de resposta mesmo se o cadastro do convidado for alterado).
* **Campos:** `display_name`, `attendance_status` (`CONFIRMED` | `DECLINED`), `is_additional_guest` (0/1), `guest_type`, timestamps.

### F. Media Upload (`media_uploads`)
Metadados de imagens e mídias armazenadas no Cloudflare R2.
* **Chave Primária:** UUID (`med_...`).
* **Relações:** `event_id` -> `events(id)` ON DELETE CASCADE; `invitation_id` -> `invitations(id)` ON DELETE SET NULL.
* **Campos:** `r2_key` (UNIQUE), `original_filename`, `mime_type`, `file_size`, `upload_type` (`GUEST_PHOTO` | `EVENT_ASSET` | `LOGO` | `GALLERY`), `status` (`PENDING` | `AVAILABLE` | `REJECTED` | `DELETED`), timestamps.

### G. Event Sections (`event_sections`) & Settings (`event_settings`)
Fundação para modularidade e configurações não relacionais do evento.
* `event_sections`: `(event_id, section_key)` UNIQUE, `enabled` (0/1), `sort_order`, `config_json`.
* `event_settings`: `(event_id, setting_key)` UNIQUE, `value_json`.

### H. Audit Log (`audit_logs`)
Trilha de auditoria para ações operacionais e de segurança.
* **Campos:** `event_id` -> `events(id)` ON DELETE CASCADE, `actor_type` (`ADMIN` | `GUEST` | `SYSTEM`), `actor_id`, `action`, `entity_type`, `entity_id`, `metadata_json`, `created_at`.

---

## 3. Políticas de Exclusão (ON DELETE)

| Relação Pai -> Filho | Política | Justificativa |
|---|---|---|
| `events` -> `invitations` | `ON DELETE CASCADE` | Exclusão do evento remove seus convites vinculados. |
| `events` -> `event_sections` | `ON DELETE CASCADE` | Seções pertencem exclusivamente ao evento. |
| `events` -> `event_settings` | `ON DELETE CASCADE` | Configurações pertencem exclusivamente ao evento. |
| `events` -> `media_uploads` | `ON DELETE CASCADE` | Mídias pertencem ao evento. |
| `events` -> `audit_logs` | `ON DELETE CASCADE` | Registros do evento são expurgados com ele. |
| `invitations` -> `guests` | `ON DELETE CASCADE` | Convidados nominais são parte da unidade do convite. |
| `invitations` -> `rsvps` | `ON DELETE CASCADE` | Resposta de RSVP é vinculada ao convite. |
| `rsvps` -> `rsvp_members` | `ON DELETE CASCADE` | Membros da resposta são removidos junto com o RSVP. |
| `guests` -> `rsvp_members` | `ON DELETE SET NULL` | Histórico forense de resposta do RSVP é preservado (`guest_id = null`) se o convidado for descadastrado. |
| `invitations` -> `media_uploads` | `ON DELETE SET NULL` | Fotos enviadas pelos convidados são preservadas no evento (`invitation_id = null`) se o convite for excluído. |

---

## 4. Índices e Performance

* `events`: `idx_events_slug` (UNIQUE), `idx_events_status`.
* `invitations`: `idx_invitations_token` (UNIQUE), `idx_invitations_event_id`, `idx_invitations_status`.
* `guests`: `idx_guests_invitation_id`, `idx_guests_sort_order`.
* `rsvps`: `idx_rsvps_status`, `uq_rsvps_invitation` (UNIQUE).
* `rsvp_members`: `idx_rsvp_members_rsvp_id`, `idx_rsvp_members_guest_id`, `idx_rsvp_members_attendance`.
* `media_uploads`: `idx_media_uploads_r2_key` (UNIQUE), `idx_media_uploads_event`, `idx_media_uploads_invitation`, `idx_media_uploads_status`.
* `event_sections`: `idx_event_sections_order`, `uq_event_sections_key` (UNIQUE).
* `event_settings`: `idx_event_settings_key`, `uq_event_settings_key` (UNIQUE).
* `audit_logs`: `idx_audit_logs_event`, `idx_audit_logs_created_at`, `idx_audit_logs_action`.