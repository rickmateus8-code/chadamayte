import React, { useState } from "react";
import { Save, CheckCircle2, Calendar, MapPin, QrCode, Sparkles, Heart } from "lucide-react";
import { updateAdminEventSettings, type AdminEventSettings } from "../../../lib/adminApi";
import { mergePortalDynamicConfig, type PortalDynamicConfig } from "../../../config/portalConfig";
import { RoyalCornerFiligree } from "../../../components/brand/RoyalOrnaments";

interface SettingsTabProps {
  token: string;
  initialSettings: AdminEventSettings | null;
  onSaved: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  token,
  initialSettings,
  onSaved,
}) => {
  const [form, setForm] = useState<AdminEventSettings>(
    initialSettings || {
      targetDate: "2026-11-22T15:30:00",
      dateFormatted: "Domingo, 22 de Novembro de 2026",
      timeFormatted: "A partir das 15h30",
      locationName: "Espaço Jardim das Flores",
      locationAddress: "Av. das Rosas, 1234 — Salão Nobre",
      locationCity: "São Paulo",
      locationState: "SP",
      mapUrl: "https://maps.google.com/?q=Av.+Paulista,+1000,+Sao+Paulo",
      pixKey: "chadamayte@familia.com.br",
      pixBeneficiary: "Papais da Maytê",
      observations:
        "Será um encontro real muito especial! Venham preparados para comemorar, brindar e registrar muitas fotos para o álbum da nossa princesinha.",
    }
  );

  const [portalCfg, setPortalCfg] = useState<PortalDynamicConfig>(() =>
    mergePortalDynamicConfig(initialSettings?.portalConfig)
  );

  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleChange = (field: keyof AdminEventSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateAdminEventSettings(token, {
      ...form,
      portalConfig: portalCfg,
    });
    setSaving(false);

    if (res.success) {
      setSavedToast(true);
      onSaved();
      window.setTimeout(() => setSavedToast(false), 3500);
    } else {
      alert(res.message || "Erro ao salvar configurações.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="floral-welcome-card"
      style={{
        position: "relative",
        textAlign: "left",
        padding: "2rem 1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.35rem",
      }}
    >
      <RoyalCornerFiligree position="tl" size={48} />
      <RoyalCornerFiligree position="tr" size={48} />
      <RoyalCornerFiligree position="bl" size={48} />
      <RoyalCornerFiligree position="br" size={48} />

      <div>
        <span className="section-eyebrow" style={{ marginBottom: "4px" }}>
          <Sparkles size={13} /> Controle Geral do Convite
        </span>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--color-text)", marginBottom: "0.25rem", marginTop: 0 }}>
          Datas, Textos de Boas-Vindas, Local & PIX
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--color-text-soft)", margin: 0 }}>
          Altere qualquer data, texto da carta de boas-vindas, endereço do salão, link do GPS e chave PIX. Tudo reflete instantaneamente no portal da Maytê!
        </p>
      </div>

      {/* 1. Bloco Datas & Prazos */}
      <div
        style={{
          background: "linear-gradient(180deg, #fffdf9 0%, #fdf3f6 100%)",
          border: "1px solid rgba(212, 169, 89, 0.4)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-text)", marginTop: 0, marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={16} color="var(--color-gold-deep)" />
          Datas & Contagem Regressiva
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Data/Hora Alvo (Relógio do Chá)</label>
            <input
              type="datetime-local"
              className="rsvp-field-input"
              value={form.targetDate.slice(0, 16)}
              onChange={(e) => handleChange("targetDate", `${e.target.value}:00`)}
            />
          </div>

          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Data por Extenso no Convite</label>
            <input
              type="text"
              className="rsvp-field-input"
              value={form.dateFormatted}
              onChange={(e) => handleChange("dateFormatted", e.target.value)}
            />
          </div>

          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Horário no Convite</label>
            <input
              type="text"
              className="rsvp-field-input"
              value={form.timeFormatted}
              onChange={(e) => handleChange("timeFormatted", e.target.value)}
            />
          </div>

          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Aviso de Prazo no Cartão R.S.V.P.</label>
            <input
              type="text"
              className="rsvp-field-input"
              value={portalCfg.rsvpDeadlineFormatted}
              onChange={(e) =>
                setPortalCfg((prev) => ({ ...prev, rsvpDeadlineFormatted: e.target.value }))
              }
              placeholder="Ex: Confirmar até 15 de Novembro de 2026"
            />
          </div>

          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Previsão de Nascimento (Fase 2 DPP)</label>
            <input
              type="text"
              className="rsvp-field-input"
              value={portalCfg.expectedBirthFormatted}
              onChange={(e) =>
                setPortalCfg((prev) => ({ ...prev, expectedBirthFormatted: e.target.value }))
              }
              placeholder="Ex: Janeiro de 2027"
            />
          </div>
        </div>
      </div>

      {/* 2. Bloco Textos da Carta de Boas-Vindas */}
      <div
        style={{
          background: "linear-gradient(180deg, #fffdf9 0%, #fdf3f6 100%)",
          border: "1px solid rgba(212, 169, 89, 0.4)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-text)", marginTop: 0, marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <Heart size={16} color="var(--color-pink-deep)" />
          Textos da Carta de Boas-Vindas
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.9rem" }}>
          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Título da Seção de Boas-Vindas</label>
            <input
              type="text"
              className="rsvp-field-input"
              value={portalCfg.welcomeTitle}
              onChange={(e) =>
                setPortalCfg((prev) => ({ ...prev, welcomeTitle: e.target.value }))
              }
            />
          </div>

          <div className="rsvp-form-field">
            <label className="rsvp-field-label">Selo / Badge Carinhoso</label>
            <input
              type="text"
              className="rsvp-field-input"
              value={portalCfg.welcomeBadge}
              onChange={(e) =>
                setPortalCfg((prev) => ({ ...prev, welcomeBadge: e.target.value }))
              }
            />
          </div>

          <div className="rsvp-form-field" style={{ gridColumn: "1 / -1" }}>
            <label className="rsvp-field-label">Parágrafo Principal de Boas-Vindas</label>
            <textarea
              rows={2}
              className="rsvp-field-input"
              value={portalCfg.welcomeSubtitle}
              onChange={(e) =>
                setPortalCfg((prev) => ({ ...prev, welcomeSubtitle: e.target.value }))
              }
            />
          </div>

          <div className="rsvp-form-field" style={{ gridColumn: "1 / -1" }}>
            <label className="rsvp-field-label">Frase Destaque em Rosa Imperial</label>
            <input
              type="text"
              className="rsvp-field-input"
              value={portalCfg.welcomeHighlightQuote}
              onChange={(e) =>
                setPortalCfg((prev) => ({ ...prev, welcomeHighlightQuote: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* 3. Bloco Local & GPS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
        <div className="rsvp-form-field">
          <label className="rsvp-field-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={14} color="var(--color-gold-deep)" />
            Nome do Local / Salão
          </label>
          <input
            type="text"
            className="rsvp-field-input"
            value={form.locationName}
            onChange={(e) => handleChange("locationName", e.target.value)}
          />
        </div>

        <div className="rsvp-form-field">
          <label className="rsvp-field-label">Endereço e Número</label>
          <input
            type="text"
            className="rsvp-field-input"
            value={form.locationAddress}
            onChange={(e) => handleChange("locationAddress", e.target.value)}
          />
        </div>

        <div className="rsvp-form-field">
          <label className="rsvp-field-label">Cidade</label>
          <input
            type="text"
            className="rsvp-field-input"
            value={form.locationCity}
            onChange={(e) => handleChange("locationCity", e.target.value)}
          />
        </div>
      </div>

      <div className="rsvp-form-field">
        <label className="rsvp-field-label">Link do Google Maps / Waze</label>
        <input
          type="url"
          className="rsvp-field-input"
          value={form.mapUrl}
          onChange={(e) => handleChange("mapUrl", e.target.value)}
        />
      </div>

      {/* 4. Bloco PIX Real */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
        <div className="rsvp-form-field">
          <label className="rsvp-field-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <QrCode size={14} color="var(--color-gold-deep)" />
            Chave PIX (Para Mimos)
          </label>
          <input
            type="text"
            className="rsvp-field-input"
            value={form.pixKey}
            onChange={(e) => handleChange("pixKey", e.target.value)}
          />
        </div>

        <div className="rsvp-form-field">
          <label className="rsvp-field-label">Nome do Favorecido PIX</label>
          <input
            type="text"
            className="rsvp-field-input"
            value={form.pixBeneficiary}
            onChange={(e) => handleChange("pixBeneficiary", e.target.value)}
          />
        </div>
      </div>

      <div className="rsvp-form-field">
        <label className="rsvp-field-label">Observações / Dica Real aos Convidados</label>
        <textarea
          rows={2}
          className="rsvp-field-input"
          value={form.observations}
          onChange={(e) => handleChange("observations", e.target.value)}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button type="submit" disabled={saving} className="btn-floral-gold btn-shimmer-gold">
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar Todas as Configurações"}
        </button>

        {savedToast && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#155724", fontWeight: 700, fontSize: "0.9rem" }}>
            <CheckCircle2 size={18} />
            Configurações atualizadas no convite!
          </span>
        )}
      </div>
    </form>
  );
};
