import React, { useState } from "react";
import {
  Heart,
  Plus,
  Crown,
  Sparkles,
  Baby,
  Calendar,
  Save,
  CheckCircle2,
  Users,
  Check,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import {
  updateAdminEventSettings,
  type AdminOverview,
  type AdminEventSettings,
} from "../../../lib/adminApi";
import {
  mergePortalDynamicConfig,
  type PortalDynamicConfig,
  type PortalLifecycleStage,
} from "../../../config/portalConfig";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../../../components/brand/RoyalOrnaments";

interface OverviewTabProps {
  token: string;
  overview: AdminOverview;
  eventSettings: AdminEventSettings | null;
  onNewInvitation: () => void;
  onSaved: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  token,
  overview,
  eventSettings,
  onNewInvitation,
  onSaved,
}) => {
  const [config, setConfig] = useState<PortalDynamicConfig>(() =>
    mergePortalDynamicConfig(eventSettings?.portalConfig)
  );
  const [savingStage, setSavingStage] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSelectStage = async (stage: PortalLifecycleStage) => {
    const nextConfig: PortalDynamicConfig = {
      ...config,
      lifecycleStage: stage,
    };
    setConfig(nextConfig);
    setSavingStage(true);
    const res = await updateAdminEventSettings(token, {
      portalConfig: nextConfig,
    });
    setSavingStage(false);
    if (res.success) {
      setSavedToast(true);
      onSaved();
      window.setTimeout(() => setSavedToast(false), 3500);
    }
  };

  const handleSaveBirthInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStage(true);
    const res = await updateAdminEventSettings(token, {
      portalConfig: config,
    });
    setSavingStage(false);
    if (res.success) {
      setSavedToast(true);
      onSaved();
      window.setTimeout(() => setSavedToast(false), 3500);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. Cartões de Indicadores Reais */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Convites Criados</span>
            <span className="admin-stat-icon">
              <Users size={16} />
            </span>
          </div>
          <div className="admin-stat-number">{overview.totalInvitations}</div>
          <span className="admin-stat-sub">
            {overview.totalNominalGuests} convidados nominais
          </span>
        </div>

        <div className="admin-stat-card is-gold-highlight">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Presenças Confirmadas</span>
            <span className="admin-stat-icon">
              <Check size={16} />
            </span>
          </div>
          <div className="admin-stat-number">{overview.totalConfirmedPeople}</div>
          <span className="admin-stat-sub">
            {overview.confirmedAdults} adultos • {overview.confirmedChildren} crianças
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Aguardando Resposta</span>
            <span className="admin-stat-icon">
              <Clock size={16} />
            </span>
          </div>
          <div className="admin-stat-number">{overview.pendingInvitations}</div>
          <span className="admin-stat-sub">
            {overview.declinedInvitations} ausências justificadas
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Fotos no Álbum (R2)</span>
            <span className="admin-stat-icon">
              <ImageIcon size={16} />
            </span>
          </div>
          <div className="admin-stat-number">{overview.totalPhotos}</div>
          <span className="admin-stat-sub">Polaroids reveladas no baú</span>
        </div>
      </div>

      {/* 2. Seletor de Perspectiva / Fase de Vida do Portal ("Quando a Maytê Nascer") */}
      <div
        className="floral-welcome-card"
        style={{
          position: "relative",
          textAlign: "left",
          padding: "2rem 1.75rem",
        }}
      >
        <RoyalCornerFiligree position="tl" size={48} />
        <RoyalCornerFiligree position="tr" size={48} />
        <RoyalCornerFiligree position="bl" size={48} />
        <RoyalCornerFiligree position="br" size={48} />

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <span className="section-eyebrow" style={{ marginBottom: "4px" }}>
              <Crown size={13} /> Linha do Tempo & Ciclo de Vida do Portal
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--color-text)", margin: 0 }}>
              Perspectiva Atual do Portal da Maytê
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-soft)", margin: "4px 0 0 0" }}>
              Altere o modo do site conforme a jornada evolui: antes do Chá, durante a doce espera ou <strong>quando a Maytê nascer</strong>!
            </p>
          </div>

          {savedToast && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#155724",
                background: "#d4edda",
                padding: "0.45rem 0.9rem",
                borderRadius: "var(--radius-full)",
                fontWeight: 700,
                fontSize: "0.82rem",
              }}
            >
              <CheckCircle2 size={16} /> Portal atualizado ao vivo!
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {[
            {
              stage: "BABY_SHOWER" as PortalLifecycleStage,
              badge: "Fase 1 • Convite Ativo",
              title: "Chá de Fraldas da Maytê",
              desc: "Contagem regressiva para o Chá, confirmação de presença (RSVP), Boutique de Mimos e Cápsula do Tempo.",
              icon: Sparkles,
            },
            {
              stage: "WAITING_BIRTH" as PortalLifecycleStage,
              badge: "Fase 2 • Pós-Chá",
              title: "Doce Espera do Nascimento",
              desc: "Agradece a presença de todos no Chá, exibe o álbum de fotos e conta os dias para a Data Prevista do Parto.",
              icon: Calendar,
            },
            {
              stage: "MAYTE_BORN" as PortalLifecycleStage,
              badge: "Fase 3 • Grande Chegada",
              title: "👑 A Maytê Nasceu!",
              desc: "Exibe a Ficha Real de Nascimento (peso, altura, hora, maternidade) e preserva todo o acervo do Chá para sempre.",
              icon: Baby,
            },
          ].map((item) => {
            const Icon = item.icon;
            const active = config.lifecycleStage === item.stage;
            return (
              <button
                key={item.stage}
                type="button"
                disabled={savingStage}
                onClick={() => handleSelectStage(item.stage)}
                className={`rsvp-intent-card ${active ? "is-active-yes" : ""}`}
                style={{
                  textAlign: "left",
                  alignItems: "flex-start",
                  padding: "1.25rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-gold-deep)" }}>
                    {item.badge}
                  </span>
                  <span className="rsvp-intent-icon" style={{ width: "32px", height: "32px" }}>
                    <Icon size={16} />
                  </span>
                </div>
                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--color-text)", display: "block", marginBottom: "4px" }}>
                  {item.title}
                </strong>
                <span style={{ fontSize: "0.82rem", color: "var(--color-text-soft)", lineHeight: 1.45 }}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Formulário da Ficha Real de Nascimento ("Quando a Maytê Nascer") */}
        <form
          onSubmit={handleSaveBirthInfo}
          style={{
            background: "linear-gradient(180deg, #fffdf9 0%, #fdf3f6 100%)",
            border: "1.5px solid rgba(212, 169, 89, 0.45)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <Baby size={18} color="var(--color-gold-deep)" />
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", color: "var(--color-text)", margin: 0 }}>
              Ficha Real de Nascimento ("Quando a Maytê Nascer")
            </h3>
          </div>
          <p style={{ fontSize: "0.84rem", color: "var(--color-text-soft)", marginTop: 0, marginBottom: "1.1rem" }}>
            Deixe já preparado ou preencha assim que a princesa nascer. Quando a <strong>Fase 3 (A Maytê Nasceu!)</strong> estiver ativa, este cartão aparecerá em destaque no topo do portal com o contador de tempo de vida dela!
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.9rem", marginBottom: "1rem" }}>
            <div>
              <label className="rsvp-field-label">Data/Hora Exata do Parto</label>
              <input
                type="datetime-local"
                className="rsvp-field-input"
                value={config.birthInfo.birthDateIso.slice(0, 16)}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, birthDateIso: `${e.target.value}:00` },
                  }))
                }
              />
            </div>

            <div>
              <label className="rsvp-field-label">Data/Hora por Extenso</label>
              <input
                type="text"
                className="rsvp-field-input"
                value={config.birthInfo.birthDateFormatted}
                placeholder="Ex: 15 de Janeiro de 2027 • 08h42"
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, birthDateFormatted: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label className="rsvp-field-label">Peso ao Nascer</label>
              <input
                type="text"
                className="rsvp-field-input"
                value={config.birthInfo.weightGrams}
                placeholder="Ex: 3.280 g"
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, weightGrams: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label className="rsvp-field-label">Comprimento (Altura)</label>
              <input
                type="text"
                className="rsvp-field-input"
                value={config.birthInfo.heightCm}
                placeholder="Ex: 49 cm"
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, heightCm: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label className="rsvp-field-label">Maternidade / Hospital</label>
              <input
                type="text"
                className="rsvp-field-input"
                value={config.birthInfo.hospitalName}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, hospitalName: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label className="rsvp-field-label">Cidade — UF</label>
              <input
                type="text"
                className="rsvp-field-input"
                value={config.birthInfo.cityState}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, cityState: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem", marginBottom: "1rem" }}>
            <div>
              <label className="rsvp-field-label">Título Real do Anúncio de Chegada</label>
              <input
                type="text"
                className="rsvp-field-input"
                value={config.birthInfo.announcementTitle}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, announcementTitle: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label className="rsvp-field-label">Carta de Gratidão & Boas-Vindas ao Mundo</label>
              <textarea
                rows={2}
                className="rsvp-field-input"
                value={config.birthInfo.announcementMessage}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    birthInfo: { ...prev.birthInfo, announcementMessage: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <button type="submit" disabled={savingStage} className="btn-floral-gold btn-shimmer-gold">
              <Save size={16} />
              <span>{savingStage ? "Salvando..." : "Salvar Ficha de Nascimento & Fase"}</span>
            </button>

            <button type="button" onClick={onNewInvitation} className="btn-add-companion">
              <Plus size={15} /> Cadastrar Novo Convite Nominal
            </button>
          </div>
        </form>
      </div>

      {/* 3. Atalho Rápido de Criação de Convite */}
      <div
        style={{
          textAlign: "center",
          padding: "1.75rem",
          background: "linear-gradient(180deg, #fffdf9 0%, #fceef2 100%)",
          borderRadius: "var(--radius-lg)",
          border: "1px dashed var(--color-gold)",
        }}
      >
        <RoyalCrestOrnament width={150} />
        <Heart size={24} color="var(--color-pink-deep)" style={{ margin: "0 auto 0.35rem auto" }} />
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", color: "var(--color-text)", margin: 0 }}>
          Envie Convites Nominais Exclusivos via WhatsApp
        </h3>
        <p style={{ fontSize: "0.88rem", color: "var(--color-text-soft)", maxWidth: "520px", margin: "0.4rem auto 1rem auto" }}>
          Cada família recebe um link personalizado (<code>/i/codigo</code>) que já abre o convite saudando a família pelo nome!
        </p>
        <button type="button" onClick={onNewInvitation} className="btn-floral-gold">
          <Plus size={16} /> Criar Convite Nominal
        </button>
      </div>
    </div>
  );
};
