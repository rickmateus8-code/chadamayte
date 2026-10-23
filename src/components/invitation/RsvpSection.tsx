import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Check,
  Heart,
  Sparkles,
  UserPlus,
  Trash2,
  Crown,
  Gift,
  Calendar,
  MapPin,
  Printer,
  Edit3,
  User,
  Phone,
  MessageSquareHeart,
  Baby,
  Users,
} from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../brand/RoyalOrnaments";
import { invitationContent } from "../../config/invitationContent";
import { useEventContext } from "../../context/EventContext";
import { ConfettiBurst } from "./ConfettiBurst";

interface AdditionalCompanion {
  id: string;
  displayName: string;
  guestType: "ADULT" | "CHILD";
}

function formatWhatsappMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

const INSPIRATION_QUOTES = [
  "Que a princesa Maytê venha cheia de saúde, luz e bênçãos! ✨",
  "Contando os dias para celebrar esse momento mágico com vocês! 👑",
  "Nosso coração já transborda de amor pela pequena Maytê! 💖",
];

const QUICK_MIMO_CARDS = [
  {
    id: "mimo-m",
    title: "Pacote Fralda Tam. M + Lenço Umedecido",
    shortLabel: "Fralda Tam. M + Lenço",
    sub: "Primeiros meses ✨",
  },
  {
    id: "mimo-g",
    title: "Pacote Fralda Tam. G + Pomada Preventiva",
    shortLabel: "Fralda Tam. G + Pomada",
    sub: "Super útil 👑",
  },
  {
    id: "mimo-look",
    title: "Lookinho Princesa (3 a 9 meses)",
    shortLabel: "Lookinho Princesa",
    sub: "3 a 9 meses 🎀",
  },
  {
    id: "mimo-surpresa",
    title: "Mimo Especial / Carinho via PIX",
    shortLabel: "Mimo Surpresa / PIX",
    sub: "Escolha livre 💝",
  },
];

export const RsvpSection: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  const { rsvp } = invitationContent.sections;
  const {
    invitationData,
    eventSettings,
    portalConfig,
    selectedMimos,
    toggleMimo,
    addGuestbookMessage,
  } = useEventContext();

  const isPixActive = Boolean(
    portalConfig.pixEnabled &&
    eventSettings.pixKey &&
    eventSettings.pixKey.trim().length > 0 &&
    eventSettings.pixKey.trim().toLowerCase() !== "none" &&
    eventSettings.pixKey.trim().toLowerCase() !== "desativado"
  );

  const [attendanceIntent, setAttendanceIntent] = useState<"yes" | "no">("yes");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [memberDecisions, setMemberDecisions] = useState<Record<string, "CONFIRMED" | "DECLINED">>({});
  const [companions, setCompanions] = useState<AdditionalCompanion[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<"CONFIRMED" | "DECLINED" | null>(null);
  const [showVipPass, setShowVipPass] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Sync when personalized invitationData arrives
  useEffect(() => {
    if (invitationData) {
      const primaryGuest = invitationData.guests[0];
      if (primaryGuest && !name) {
        setName(primaryGuest.name);
      } else if (invitationData.invitation.displayName && !name) {
        setName(invitationData.invitation.displayName);
      }

      const initialDecisions: Record<string, "CONFIRMED" | "DECLINED"> = {};
      for (const g of invitationData.guests) {
        initialDecisions[g.id] = "CONFIRMED";
      }
      setMemberDecisions(initialDecisions);

      if (invitationData.rsvp?.data?.status) {
        const st = invitationData.rsvp.data.status;
        if (st === "CONFIRMED" || st === "PARTIAL") {
          setSubmittedStatus("CONFIRMED");
          setAttendanceIntent("yes");
          setShowVipPass(true);
        } else if (st === "DECLINED") {
          setSubmittedStatus("DECLINED");
          setAttendanceIntent("no");
        }
      }
    }
  }, [invitationData]);

  const toggleNominalGuest = (guestId: string) => {
    setMemberDecisions((prev) => ({
      ...prev,
      [guestId]: prev[guestId] === "DECLINED" ? "CONFIRMED" : "DECLINED",
    }));
  };

  const handleAddCompanion = () => {
    const maxAllowed = invitationData
      ? invitationData.invitation.allowAdditionalGuests
        ? Math.max(1, invitationData.invitation.maxAdditionalGuests)
        : 0
      : 4;

    if (companions.length >= maxAllowed) return;
    setCompanions((prev) => [
      ...prev,
      { id: `comp-${Date.now()}-${prev.length}`, displayName: "", guestType: "ADULT" },
    ]);
  };

  const handleUpdateCompanion = (
    id: string,
    field: "displayName" | "guestType",
    value: string
  ) => {
    setCompanions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveCompanion = (id: string) => {
    setCompanions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (!name.trim()) {
      setFeedbackError("Por favor, informe seu nome completo para registrarmos no livro real.");
      return;
    }

    setSubmitting(true);
    const responseType = attendanceIntent;

    // Combine affectionate message + chosen mimos + custom question answers so parents see everything in /admin
    const mimoSuffix =
      responseType === "yes" && selectedMimos.length > 0
        ? ` [Mimos: ${selectedMimos.join(", ")}]`
        : "";

    const activeQuestions = portalConfig.customQuestions.filter((q) => q.enabled);
    const answeredPairs = activeQuestions
      .map((q) => {
        const val = (customAnswers[q.id] || "").trim();
        return val ? `${q.label}: ${val}` : "";
      })
      .filter(Boolean);

    const customAnswersSuffix =
      answeredPairs.length > 0 ? ` [Respostas: ${answeredPairs.join(" | ")}]` : "";

    const combinedNotes = `${notes.trim()}${mimoSuffix}${customAnswersSuffix}`.trim();

    try {
      if (token && invitationData) {
        const nominalMembers =
          invitationData.guests.length > 0
            ? invitationData.guests.map((g) => ({
                guestId: g.id,
                displayName: g.name,
                attendanceStatus:
                  responseType === "no"
                    ? ("DECLINED" as const)
                    : memberDecisions[g.id] || ("CONFIRMED" as const),
                isAdditionalGuest: false,
                guestType: g.guestType || ("ADULT" as const),
              }))
            : [
                {
                  displayName: name.trim(),
                  attendanceStatus:
                    responseType === "yes" ? ("CONFIRMED" as const) : ("DECLINED" as const),
                  isAdditionalGuest: false,
                  guestType: "ADULT" as const,
                },
              ];

        const validCompanions =
          responseType === "yes"
            ? companions
                .filter((c) => c.displayName.trim() !== "")
                .map((c) => ({
                  displayName: c.displayName.trim(),
                  attendanceStatus: "CONFIRMED" as const,
                  isAdditionalGuest: true,
                  guestType: c.guestType,
                }))
            : [];

        const res = await fetch(`/api/invitations/${token}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactName: name.trim(),
            contactWhatsapp: whatsapp.trim() || undefined,
            notes: combinedNotes || undefined,
            members: [...nominalMembers, ...validCompanions],
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          setFeedbackError(err.message || "Não foi possível registrar sua confirmação.");
          setSubmitting(false);
          return;
        }
      } else {
        // Public route `/` — persist to D1 / SQLite via /api/invitations/public-rsvp
        const validCompanions =
          responseType === "yes"
            ? companions
                .filter((c) => c.displayName.trim() !== "")
                .map((c) => ({
                  displayName: c.displayName.trim(),
                  guestType: c.guestType,
                }))
            : [];

        const res = await fetch("/api/invitations/public-rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactName: name.trim(),
            contactWhatsapp: whatsapp.trim() || undefined,
            notes: combinedNotes || undefined,
            attendanceStatus: responseType === "yes" ? "CONFIRMED" : "DECLINED",
            additionalGuests: validCompanions,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setFeedbackError((err as any).message || "Não foi possível registrar sua confirmação.");
          setSubmitting(false);
          return;
        }
      }

      if (notes.trim()) {
        addGuestbookMessage(name.trim(), notes.trim());
      }

      if (responseType === "yes") {
        setSubmittedStatus("CONFIRMED");
        setShowVipPass(true);
        setShowConfetti(true);
        window.setTimeout(() => setShowConfetti(false), 4500);
      } else {
        setSubmittedStatus("DECLINED");
        setShowVipPass(false);
      }
    } catch {
      setFeedbackError("Erro de conexão ao registrar confirmação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalConfirmedPeopleCount = () => {
    if (invitationData && invitationData.guests.length > 0) {
      const nominalCount = invitationData.guests.filter(
        (g) => (memberDecisions[g.id] || "CONFIRMED") === "CONFIRMED"
      ).length;
      const compCount = companions.filter((c) => c.displayName.trim() !== "").length;
      return Math.max(1, nominalCount + compCount);
    }
    return 1 + companions.filter((c) => c.displayName.trim() !== "").length;
  };

  return (
    <section id="rsvp-section" className="invitation-section reveal-on-scroll" aria-label="Confirmar Presença">
      <ConfettiBurst active={showConfetti} />

      <div className="invitation-container-narrow">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <RoyalCrestOrnament width={190} />
          <span className="section-eyebrow">
            <Crown size={13} />
            Sua Presença é Indispensável
          </span>
          <h2 className="section-title">
            {rsvp.title}
          </h2>
          <p className="section-subtitle">
            {rsvp.subtitle}
          </p>
        </div>

        {/* Saudação Personalizada se veio por link nominal /i/:token */}
        {invitationData && (
          <div className="rsvp-personalized-banner">
            <span className="rsvp-personalized-eyebrow">
              <Sparkles size={12} /> Convite Nominal Exclusivo <Sparkles size={12} />
            </span>
            <h3 className="rsvp-personalized-title">
              {invitationData.invitation.displayName}
            </h3>
            {invitationData.invitation.salutation && (
              <p className="rsvp-personalized-salutation">
                “{invitationData.invitation.salutation}”
              </p>
            )}
          </div>
        )}

        {/* SE JÁ CONFIRMOU PRESENÇA: EXIBE O PASSE REAL VIP DOURADO */}
        {showVipPass && submittedStatus === "CONFIRMED" ? (
          <div className="royal-vip-pass-card" role="region" aria-label="Passe Real de Presença Confirmada">
            <RoyalCornerFiligree position="tl" size={50} />
            <RoyalCornerFiligree position="tr" size={50} />
            <RoyalCornerFiligree position="bl" size={50} />
            <RoyalCornerFiligree position="br" size={50} />

            <div className="royal-vip-header">
              <img
                src="/images/mayte-royal-crown.png"
                alt="Coroa Real da Maytê"
                className="royal-vip-crown"
              />
              <span className="royal-vip-badge">
                <Check size={13} /> PRESENÇA REAL CONFIRMADA
              </span>
              <h3 className="royal-vip-title">
                Passe Especial • {eventSettings.name}
              </h3>
            </div>

            <div className="royal-vip-body">
              <div className="royal-vip-row">
                <span className="royal-vip-label">Convidado(a) / Família</span>
                <strong className="royal-vip-value">
                  {invitationData?.invitation?.displayName || name}
                </strong>
              </div>

              <div className="royal-vip-row">
                <span className="royal-vip-label">Lugares Reservados</span>
                <strong className="royal-vip-value">
                  {totalConfirmedPeopleCount()}{" "}
                  {totalConfirmedPeopleCount() === 1 ? "Pessoa Confirmada" : "Pessoas Confirmadas"}
                </strong>
              </div>

              <div className="royal-vip-divider" />

              <div className="royal-vip-event-meta">
                <div>
                  <Calendar size={14} color="var(--color-gold-deep)" />
                  <span>{eventSettings.dateFormatted} • {eventSettings.timeFormatted}</span>
                </div>
                <div>
                  <MapPin size={14} color="var(--color-gold-deep)" />
                  <span>{eventSettings.locationName} ({eventSettings.locationAddress})</span>
                </div>
              </div>

              {selectedMimos.length > 0 && (
                <div className="royal-vip-mimos-box">
                  <span className="royal-vip-label">Mimo(s) Escolhido(s) com Carinho:</span>
                  <div className="royal-vip-mimos-tags">
                    {selectedMimos.map((m) => (
                      <span key={m} className="royal-vip-mimo-pill">
                        <Gift size={12} /> {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="royal-vip-footer">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-mini-luxury"
              >
                <Printer size={14} />
                Guardar / Imprimir Passe
              </button>
              <button
                type="button"
                onClick={() => setShowVipPass(false)}
                className="btn-mini-luxury"
              >
                <Edit3 size={14} />
                Editar Confirmação
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO REFINADO DE CARTÃO DE RESPOSTA REAL */
          <form onSubmit={handleSubmit} className="floral-rsvp-card royal-rsvp-stationery-form">
            <RoyalCornerFiligree position="tl" size={52} />
            <RoyalCornerFiligree position="tr" size={52} />
            <RoyalCornerFiligree position="bl" size={52} />
            <RoyalCornerFiligree position="br" size={52} />

            {/* 1. Cabeçalho de Cartão de Resposta Real (Répondez S'il Vous Plaît) */}
            <div className="rsvp-stationery-header">
              <div className="rsvp-stationery-seal">
                <Crown size={18} color="var(--color-gold-deep)" />
              </div>
              <span className="rsvp-stationery-subtitle">Répondez S'il Vous Plaît</span>
              <h3 className="rsvp-stationery-heading">Cartão de Resposta Real</h3>
              {portalConfig.rsvpDeadlineFormatted && (
                <span style={{ fontSize: "0.78rem", color: "var(--color-gold-deep)", fontWeight: 600, display: "block", marginTop: "2px" }}>
                  ✨ {portalConfig.rsvpDeadlineFormatted}
                </span>
              )}
              <div className="rsvp-stationery-divider" aria-hidden="true">
                <span>✦</span>
              </div>
            </div>

            {submittedStatus === "DECLINED" && (
              <div className="rsvp-declined-notice">
                <Heart size={18} fill="var(--color-pink)" color="var(--color-pink-deep)" />
                <span>
                  Recebemos seu carinho e registramos sua ausência! Se os planos mudarem, basta selecionar <strong>"Estarei Presente"</strong> abaixo.
                </span>
              </div>
            )}

            {feedbackError && (
              <div className="rsvp-error-banner" role="alert">
                {feedbackError}
              </div>
            )}

            {/* 2. Seletor Interativo de Presença no Topo */}
            <div className="rsvp-intent-selector" role="radiogroup" aria-label="Você poderá comparecer?">
              <button
                type="button"
                role="radio"
                aria-checked={attendanceIntent === "yes"}
                onClick={() => setAttendanceIntent("yes")}
                className={`rsvp-intent-card ${attendanceIntent === "yes" ? "is-active-yes" : ""}`}
              >
                <span className="rsvp-intent-icon">
                  <Sparkles size={18} />
                </span>
                <span className="rsvp-intent-title">Sim, estarei presente!</span>
                <span className="rsvp-intent-desc">Celebrarei com a princesa Maytê ✨</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={attendanceIntent === "no"}
                onClick={() => setAttendanceIntent("no")}
                className={`rsvp-intent-card ${attendanceIntent === "no" ? "is-active-no" : ""}`}
              >
                <span className="rsvp-intent-icon">
                  <Heart size={18} />
                </span>
                <span className="rsvp-intent-title">Não poderei ir</span>
                <span className="rsvp-intent-desc">Mas envio meu recado de amor 🤍</span>
              </button>
            </div>

            {/* 3. Campos de Input com Ícones Dourados Embutidos e Máscara */}
            <div className="rsvp-fields-grid">
              <div className="rsvp-form-field">
                <label htmlFor="rsvp-name-input" className="rsvp-field-label">
                  Seu Nome ou Família *
                </label>
                <div className="royal-input-group">
                  <span className="royal-input-icon" aria-hidden="true">
                    <User size={17} />
                  </span>
                  <input
                    id="rsvp-name-input"
                    type="text"
                    className="rsvp-field-input with-icon"
                    placeholder="Ex: Maria Clara & Família"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="rsvp-form-field">
                <label htmlFor="rsvp-whatsapp-input" className="rsvp-field-label">
                  WhatsApp com DDD
                </label>
                <div className="royal-input-group">
                  <span className="royal-input-icon" aria-hidden="true">
                    <Phone size={17} />
                  </span>
                  <input
                    id="rsvp-whatsapp-input"
                    type="tel"
                    inputMode="numeric"
                    className="rsvp-field-input with-icon"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatWhatsappMask(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Lista Nominal de Membros da Família (quando há convidados no token) */}
            {attendanceIntent === "yes" && invitationData && invitationData.guests.length > 0 && (
              <div className="rsvp-nominal-guests-box">
                <span className="rsvp-field-label">
                  <Users size={14} color="var(--color-gold-deep)" />
                  Confirme quem da família estará presente:
                </span>
                <div className="rsvp-nominal-list">
                  {invitationData.guests.map((guest) => {
                    const isConfirmed = (memberDecisions[guest.id] || "CONFIRMED") === "CONFIRMED";
                    return (
                      <button
                        key={guest.id}
                        type="button"
                        onClick={() => toggleNominalGuest(guest.id)}
                        className={`rsvp-nominal-toggle ${isConfirmed ? "is-confirmed" : "is-declined"}`}
                      >
                        <span className="rsvp-nominal-name">{guest.name}</span>
                        <span className="rsvp-nominal-status">
                          {isConfirmed ? "✓ Confirmado" : "Não irá"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Painel de Acompanhantes Preenchido em Seda Rosê (Sem <select> nativo) */}
            {attendanceIntent === "yes" && (!invitationData || invitationData.invitation.allowAdditionalGuests) && (
              <div className="royal-companions-panel">
                <div className="rsvp-companions-header">
                  <div>
                    <span className="rsvp-field-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Users size={14} color="var(--color-gold-deep)" />
                      Acompanhantes da Família
                    </span>
                    <span className="rsvp-companions-sub">
                      {companions.length === 0
                        ? "Vai levar cônjuge ou filhos? Adicione abaixo:"
                        : `${companions.length} acompanhante${companions.length === 1 ? "" : "s"} adicionado${companions.length === 1 ? "" : "s"}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCompanion}
                    className="btn-add-companion"
                  >
                    <UserPlus size={14} />
                    <span>+ Acompanhante</span>
                  </button>
                </div>

                {companions.length > 0 && (
                  <div className="rsvp-companions-list">
                    {companions.map((comp, idx) => (
                      <div key={comp.id} className="royal-companion-card-row">
                        <div className="royal-input-group" style={{ flex: 1 }}>
                          <span className="royal-input-icon" aria-hidden="true">
                            {comp.guestType === "CHILD" ? <Baby size={16} /> : <User size={16} />}
                          </span>
                          <input
                            type="text"
                            className="rsvp-field-input with-icon"
                            placeholder={`Nome do acompanhante ${idx + 1}`}
                            value={comp.displayName}
                            onChange={(e) =>
                              handleUpdateCompanion(comp.id, "displayName", e.target.value)
                            }
                          />
                        </div>

                        <div className="royal-companion-type-pills" role="group" aria-label="Tipo de acompanhante">
                          <button
                            type="button"
                            onClick={() => handleUpdateCompanion(comp.id, "guestType", "ADULT")}
                            className={`companion-type-pill ${comp.guestType === "ADULT" ? "is-active" : ""}`}
                          >
                            Adulto
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateCompanion(comp.id, "guestType", "CHILD")}
                            className={`companion-type-pill ${comp.guestType === "CHILD" ? "is-active" : ""}`}
                          >
                            Criança
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCompanion(comp.id)}
                          className="btn-remove-companion"
                          aria-label="Remover acompanhante"
                          title="Remover acompanhante"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Grade Simétrica 2x2 de Mini-Cartões para Escolha de Mimo/Fralda */}
            {attendanceIntent === "yes" && (
              <div className="rsvp-mimos-picker">
                <div className="rsvp-mimos-header">
                  <span className="rsvp-field-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Gift size={14} color="var(--color-gold-deep)" />
                    Mimo ou Fralda que deseja levar (Opcional)
                  </span>
                  {selectedMimos.length > 0 && (
                    <span className="rsvp-mimos-count-badge">
                      {selectedMimos.length} selecionado{selectedMimos.length === 1 ? "" : "s"} ✓
                    </span>
                  )}
                </div>

                <div className="rsvp-mimo-grid-2x2">
                  {(portalConfig.rsvpQuickMimos.filter((m) => m.enabled && (isPixActive || (!m.label.toUpperCase().includes('PIX') && !m.category.toUpperCase().includes('PIX')))).length > 0
                    ? portalConfig.rsvpQuickMimos
                        .filter((m) => m.enabled && (isPixActive || (!m.label.toUpperCase().includes('PIX') && !m.category.toUpperCase().includes('PIX'))))
                        .map((m) => ({
                          id: m.id,
                          title: m.label,
                          shortLabel: m.label,
                          sub: m.category,
                        }))
                    : QUICK_MIMO_CARDS.filter((c) => isPixActive || !c.title.toUpperCase().includes('PIX'))
                  ).map((card) => {
                    const active = selectedMimos.includes(card.title);
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => toggleMimo(card.title)}
                        className={`rsvp-mimo-mini-card ${active ? "is-active" : ""}`}
                        aria-pressed={active}
                      >
                        <div className="rsvp-mimo-mini-top">
                          <span className="rsvp-mimo-mini-sub">{card.sub}</span>
                          <span className={`rsvp-mimo-mini-check ${active ? "is-checked" : ""}`}>
                            {active ? <Check size={12} /> : "+"}
                          </span>
                        </div>
                        <strong className="rsvp-mimo-mini-title">{card.shortLabel}</strong>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5b. Perguntas Personalizadas Dinâmicas (Configuráveis e Arrastáveis no Admin) */}
            {portalConfig.customQuestions.filter((q) => q.enabled).length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.1rem" }}>
                {portalConfig.customQuestions
                  .filter((q) => q.enabled)
                  .map((q) => (
                    <div key={q.id} className="rsvp-form-field">
                      <label className="rsvp-field-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Sparkles size={13} color="var(--color-gold-deep)" />
                        <span>
                          {q.label} {q.required ? "*" : ""}
                        </span>
                      </label>

                      {q.type === "SELECT_PILLS" && Array.isArray(q.options) && q.options.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.35rem" }}>
                          {q.options.map((opt) => {
                            const isSelected = customAnswers[q.id] === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  setCustomAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: isSelected ? "" : opt,
                                  }))
                                }
                                className={`companion-type-pill ${isSelected ? "is-active" : ""}`}
                                style={{
                                  padding: "0.45rem 0.9rem",
                                  borderRadius: "var(--radius-full)",
                                  border: isSelected
                                    ? "1.5px solid var(--color-gold)"
                                    : "1px solid rgba(212, 169, 89, 0.35)",
                                  background: isSelected
                                    ? "linear-gradient(135deg, #fff6de 0%, #fde9f0 100%)"
                                    : "#fff",
                                  color: isSelected ? "var(--color-gold-deep)" : "var(--color-text-soft)",
                                  fontWeight: isSelected ? 700 : 500,
                                  fontSize: "0.82rem",
                                  cursor: "pointer",
                                }}
                              >
                                {isSelected ? `✓ ${opt}` : opt}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          type="text"
                          className="rsvp-field-input"
                          placeholder={q.placeholder || "Sua resposta..."}
                          value={customAnswers[q.id] || ""}
                          required={q.required}
                          onChange={(e) =>
                            setCustomAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                        />
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* 6. Campo de Mensagem sem quebra órfã + Pílulas de Inspiração em 1 Toque */}
            <div className="rsvp-form-field">
              <div className="rsvp-message-label-row">
                <label htmlFor="rsvp-notes-input" className="rsvp-field-label" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <MessageSquareHeart size={14} color="var(--color-pink-deep)" />
                  <span>Mensagem para a Cápsula do Tempo da {eventSettings.babyName}</span>
                </label>
                <span className="rsvp-char-hint">Opcional ❤️</span>
              </div>

              <textarea
                id="rsvp-notes-input"
                rows={3}
                className="rsvp-field-input rsvp-textarea-luxury"
                placeholder="Escreva um desejo especial para a Maytê ler quando crescer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              {/* Sugestões Rápidas de Carinho em 1 Toque */}
              <div className="rsvp-inspiration-box">
                <span className="rsvp-inspiration-label">
                  <Sparkles size={11} /> Toque para usar uma sugestão carinhosa:
                </span>
                <div className="rsvp-inspiration-pills">
                  {(portalConfig.inspirationQuotes.filter((q) => q.enabled).length > 0
                    ? portalConfig.inspirationQuotes.filter((q) => q.enabled).map((q) => q.text)
                    : INSPIRATION_QUOTES
                  ).map((quote, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNotes(quote)}
                      className="rsvp-inspiration-pill"
                    >
                      “{quote}”
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão Único Nobre Adaptativo */}
            <div className="rsvp-buttons-stack">
              <button
                type="submit"
                disabled={submitting}
                className={attendanceIntent === "yes" ? "btn-rsvp-confirm btn-shimmer-gold" : "btn-rsvp-decline-submit"}
              >
                {attendanceIntent === "yes" ? <Sparkles size={18} /> : <Heart size={17} />}
                <span>
                  {submitting
                    ? "Registrando no Livro Real..."
                    : attendanceIntent === "yes"
                      ? rsvp.acceptButtonText
                      : "ENVIAR MEU CARINHO AOS PAPAIS 🤍"}
                </span>
              </button>
            </div>
          </form>
        )}

        <FloralDivider />
      </div>
    </section>
  );
};
