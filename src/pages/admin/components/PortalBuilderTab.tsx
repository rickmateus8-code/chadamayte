import React, { useState } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  Gift,
  HelpCircle,
  MessageSquareHeart,
  Crown,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  QrCode,
  Baby,
  Shirt,
  PackageCheck,
  Smile,
  Milk,
  ShoppingBag,
  Star,
  Music,
  HeartHandshake,
  Heart,
  Clock,
  MapPin,
  Camera,
  Check,
  X,
  Smartphone,
} from "lucide-react";
import {
  mergePortalDynamicConfig,
  type PortalDynamicConfig,
  type DraggableCustomQuestion,
  type GiftCategory,
  type DraggableGiftItem,
} from "../../../config/portalConfig";
import { updateAdminEventSettings } from "../../../lib/adminApi";
import { RoyalCornerFiligree } from "../../../components/brand/RoyalOrnaments";

interface PortalBuilderTabProps {
  token: string;
  initialPortalConfig?: Partial<PortalDynamicConfig> | null;
  onSaved: () => void;
}

type BuilderSectionKey =
  | "sections"
  | "boutique"
  | "questions"
  | "rsvpMimos"
  | "inspirations"
  | "crown";

const AVAILABLE_ICONS = [
  { name: "PackageCheck", label: "Fraldas / Pacote", icon: PackageCheck },
  { name: "Shirt", label: "Lookinho / Roupa", icon: Shirt },
  { name: "Sparkles", label: "Higiene / Brilho", icon: Sparkles },
  { name: "Baby", label: "Bebê / Passeio", icon: Baby },
  { name: "Gift", label: "Presente Real", icon: Gift },
  { name: "Crown", label: "Coroa Real", icon: Crown },
  { name: "Smile", label: "Ursinho / Sorriso", icon: Smile },
  { name: "Milk", label: "Mamadeira / Nutrição", icon: Milk },
  { name: "ShoppingBag", label: "Boutique / Sacola", icon: ShoppingBag },
  { name: "Star", label: "Estrela Dourada", icon: Star },
  { name: "Music", label: "Caixa de Música", icon: Music },
  { name: "Heart", label: "Coração / Amor", icon: Heart },
  { name: "HeartHandshake", label: "Carinho / Afeto", icon: HeartHandshake },
];

export const PortalBuilderTab: React.FC<PortalBuilderTabProps> = ({
  token,
  initialPortalConfig,
  onSaved,
}) => {
  const [config, setConfig] = useState<PortalDynamicConfig>(() =>
    mergePortalDynamicConfig(initialPortalConfig)
  );
  const [activeSubTab, setActiveSubTab] = useState<BuilderSectionKey>("sections");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Icon Picker Modal State
  const [iconPickerTarget, setIconPickerTarget] = useState<{
    type: "category" | "gift";
    id: string;
  } | null>(null);

  // Reorder helper
  const reorderList = <T,>(list: T[], fromIdx: number, toIdx: number): T[] => {
    if (toIdx < 0 || toIdx >= list.length || fromIdx === toIdx) return list;
    const copy = [...list];
    const [moved] = copy.splice(fromIdx, 1);
    if (moved === undefined) return list;
    copy.splice(toIdx, 0, moved);
    return copy;
  };

  const handleSaveBuilder = async () => {
    setSaving(true);
    const res = await updateAdminEventSettings(token, {
      portalConfig: config,
    });
    setSaving(false);
    if (res.success) {
      setSavedToast(true);
      onSaved();
      window.setTimeout(() => setSavedToast(false), 3500);
    } else {
      alert(res.message || "Não foi possível salvar as alterações.");
    }
  };

  // Helper to render icon by name
  const renderNamedIcon = (iconName: string | undefined, size = 18, color = "currentColor") => {
    const found = AVAILABLE_ICONS.find((i) => i.name === iconName);
    const IconComp = found ? found.icon : Gift;
    return <IconComp size={size} color={color} />;
  };

  // 1. ADD HELPERS
  const addCustomQuestion = () => {
    const newQ: DraggableCustomQuestion = {
      id: `cq_${Date.now()}`,
      label: "Nova pergunta para os convidados",
      placeholder: "Digite sua resposta...",
      type: "TEXT",
      options: ["Opção 1", "Opção 2"],
      required: false,
      enabled: true,
    };
    setConfig((prev) => ({
      ...prev,
      customQuestions: [...prev.customQuestions, newQ],
    }));
  };

  const addQuickMimo = () => {
    setConfig((prev) => ({
      ...prev,
      rsvpQuickMimos: [
        ...prev.rsvpQuickMimos,
        {
          id: `qm_${Date.now()}`,
          category: "Sugestão Real ✨",
          label: "Novo Mimo / Fralda",
          enabled: true,
        },
      ],
    }));
  };

  const addGiftCategory = () => {
    const newCat: GiftCategory = {
      id: `cat_${Date.now()}`,
      name: "Nova Categoria Real",
      icon: "Gift",
      description: "Descrição carinhosa da categoria de presentes",
    };
    setConfig((prev) => ({
      ...prev,
      giftCategories: [...prev.giftCategories, newCat],
    }));
  };

  const addBoutiqueGift = () => {
    const firstCat = config.giftCategories[0]?.id || "fraldas";
    const newGift: DraggableGiftItem = {
      id: `gift_${Date.now()}`,
      title: "Novo Mimo da Boutique",
      category: firstCat,
      description: "Descrição carinhosa da sugestão para a Maytê.",
      icon: "Gift",
      highlight: false,
      enabled: true,
    };
    setConfig((prev) => ({
      ...prev,
      giftItems: [...prev.giftItems, newGift],
    }));
  };

  const addInspirationQuote = () => {
    setConfig((prev) => ({
      ...prev,
      inspirationQuotes: [
        ...prev.inspirationQuotes,
        {
          id: `iq_${Date.now()}`,
          text: "Que a chegada da Maytê seja repleta de bênçãos e alegria! ✨",
          enabled: true,
        },
      ],
    }));
  };

  const addCrownBlessing = () => {
    setConfig((prev) => ({
      ...prev,
      crownBlessings: [
        ...prev.crownBlessings,
        {
          id: `cb_${Date.now()}`,
          text: "👑 Princesa Maytê • Amor que transborda! ✨",
          enabled: true,
        },
      ],
    }));
  };

  return (
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

      {/* Header com Ações */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <span className="section-eyebrow" style={{ marginBottom: "4px" }}>
            <Sparkles size={13} /> Personalização Total & Arrastável
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.75rem",
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            Construtor Interativo do Formulário & Convite
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-soft)", margin: "4px 0 0 0" }}>
            Arraste pela alça dourada (<strong>⋮⋮</strong>) ou use as setas para reordenar seções, mimos, categorias e perguntas com preview em tempo real.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
              <CheckCircle2 size={16} /> Salvo no Convite!
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveBuilder}
            disabled={saving}
            className="btn-floral-gold btn-shimmer-gold"
          >
            <Save size={16} />
            <span>{saving ? "Salvando..." : "Salvar Alterações no Portal"}</span>
          </button>
        </div>
      </div>

      {/* Sub-abas do Construtor */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px dashed rgba(212, 169, 89, 0.4)",
        }}
      >
        {[
          { id: "sections", label: "Ordem das Seções & Preview Real", icon: Layers },
          { id: "boutique", label: `Boutique de Mimos & Categorias (${config.giftItems.length})`, icon: Gift },
          { id: "questions", label: `Perguntas do RSVP (${config.customQuestions.length})`, icon: HelpCircle },
          { id: "rsvpMimos", label: `Mimos Rápidos RSVP (${config.rsvpQuickMimos.length})`, icon: Sparkles },
          { id: "inspirations", label: `Frases Cápsula (${config.inspirationQuotes.length})`, icon: MessageSquareHeart },
          { id: "crown", label: `Bênçãos da Coroa (${config.crownBlessings.length})`, icon: Crown },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as BuilderSectionKey)}
              className={`boutique-filter-pill ${active ? "is-active" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          ABA 1: ORDEM DAS SEÇÕES & PREVIEW EM TEMPO REAL
      ========================================================================= */}
      {activeSubTab === "sections" && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--color-text)" }}>
              Gerencie todas as áreas do convite da Maytê. Arraste as seções para mudar a ordem ou use os botões <strong>▲</strong> e <strong>▼</strong>. Use o ícone de olho para ativar ou ocultar cada área.
            </p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-gold-deep)", fontWeight: 600 }}>
              ✨ O Mockup ao lado exibe o convite em sincronia viva conforme você organiza!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.75rem",
              alignItems: "start",
            }}
          >
            {/* Coluna 1: Lista Arrastável das 7 Seções */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.4rem 0.5rem",
                  borderBottom: "1px solid rgba(212, 169, 89, 0.2)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--color-text-soft)",
                }}
              >
                <span>SEÇÃO / ÁREA DO CONVITE</span>
                <span>AÇÕES</span>
              </div>

              {config.portalSections.map((sec, idx) => {
                const getSectionIcon = (key: string) => {
                  switch (key) {
                    case "countdown":
                      return <Clock size={16} color="var(--color-gold-deep)" />;
                    case "welcome":
                      return <Crown size={16} color="var(--color-gold-deep)" />;
                    case "details":
                      return <MapPin size={16} color="var(--color-gold-deep)" />;
                    case "gifts":
                      return <Gift size={16} color="var(--color-gold-deep)" />;
                    case "rsvp":
                      return <CheckCircle2 size={16} color="var(--color-gold-deep)" />;
                    case "memories":
                      return <Camera size={16} color="var(--color-gold-deep)" />;
                    case "capsule":
                      return <MessageSquareHeart size={16} color="var(--color-gold-deep)" />;
                    default:
                      return <Sparkles size={16} color="var(--color-gold-deep)" />;
                  }
                };

                return (
                  <div
                    key={sec.id}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(idx);
                    }}
                    onDrop={() => {
                      if (dragIndex !== null) {
                        setConfig((prev) => ({
                          ...prev,
                          portalSections: reorderList(prev.portalSections, dragIndex, idx),
                        }));
                      }
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className={`admin-draggable-card ${dragOverIndex === idx ? "is-drag-over" : ""} ${!sec.enabled ? "is-muted-card" : ""}`}
                    style={{
                      borderLeft: sec.enabled ? "4px solid var(--color-gold)" : "4px solid #bbb",
                      background: sec.enabled ? "rgba(255, 255, 255, 0.95)" : "rgba(240, 240, 240, 0.6)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div className="admin-draggable-row">
                      <button
                        type="button"
                        className="drag-handle"
                        aria-label="Arrastar área do convite"
                        title="Segure e arraste para mudar a ordem"
                      >
                        <GripVertical size={18} />
                      </button>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "var(--radius-full)",
                            background: sec.enabled ? "rgba(212, 169, 89, 0.15)" : "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {getSectionIcon(sec.key)}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                color: sec.enabled ? "var(--color-gold-deep)" : "#999",
                                letterSpacing: "0.05em",
                              }}
                            >
                              ORDEM #{idx + 1}
                            </span>
                            {!sec.enabled && (
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  background: "#eee",
                                  color: "#777",
                                  fontWeight: 600,
                                }}
                              >
                                Oculta
                              </span>
                            )}
                          </div>
                          <strong
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "1.05rem",
                              color: sec.enabled ? "var(--color-text)" : "#888",
                              display: "block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {sec.title}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--color-text-soft)",
                              display: "block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {sec.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="admin-draggable-actions">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              portalSections: reorderList(prev.portalSections, idx, idx - 1),
                            }))
                          }
                          disabled={idx === 0}
                          className="btn-icon-royal"
                          title="Subir posição"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              portalSections: reorderList(prev.portalSections, idx, idx + 1),
                            }))
                          }
                          disabled={idx === config.portalSections.length - 1}
                          className="btn-icon-royal"
                          title="Descer posição"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              portalSections: prev.portalSections.map((it, i) =>
                                i === idx ? { ...it, enabled: !it.enabled } : it
                              ),
                            }))
                          }
                          className="btn-icon-royal"
                          title={sec.enabled ? "Clique para ocultar esta área do convite" : "Clique para reativar esta área"}
                          style={{
                            background: sec.enabled ? "rgba(39, 174, 96, 0.1)" : "rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {sec.enabled ? <Eye size={16} color="#27ae60" /> : <EyeOff size={16} color="#888" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coluna 2: Mockup Interativo em Tempo Real do Convite */}
            <div
              style={{
                position: "sticky",
                top: "1.5rem",
                borderRadius: "var(--radius-xl)",
                border: "2px solid rgba(212, 169, 89, 0.45)",
                background: "linear-gradient(180deg, #fffcf9 0%, #fff6ed 100%)",
                boxShadow: "0 12px 36px rgba(184, 134, 11, 0.12)",
                padding: "1.25rem",
                overflow: "hidden",
              }}
            >
              {/* Moldura de Smartphone / Papelaria Real */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px dashed rgba(212, 169, 89, 0.35)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Smartphone size={16} color="var(--color-gold-deep)" />
                  <strong style={{ fontSize: "0.85rem", color: "var(--color-text)", fontFamily: "var(--font-serif)" }}>
                    Preview do Convite em Tempo Real
                  </strong>
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: "rgba(39, 174, 96, 0.15)",
                    color: "#1e7e34",
                    fontWeight: 700,
                  }}
                >
                  ● Sincronizado
                </span>
              </div>

              {/* Corpo do Mockup */}
              <div
                style={{
                  maxHeight: "560px",
                  overflowY: "auto",
                  paddingRight: "4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {/* 1. Mini Capa Real (Fixo) */}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(212, 169, 89, 0.3)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.85rem",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <img
                    src="/images/mayte-royal-crown.png"
                    alt="Coroa"
                    style={{ width: "32px", height: "auto", margin: "0 auto 4px auto", display: "block" }}
                  />
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--color-gold-deep)", fontWeight: 700 }}>
                    CHÁ DE FRALDAS DA MAYTÊ
                  </span>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-soft)", marginTop: "2px" }}>
                    Domingo, 22 de Novembro de 2026 • 15h30
                  </div>
                </div>

                {/* 2. Seções Dinâmicas em Cascata conforme Ordenadas */}
                {config.portalSections.map((sec, idx) => {
                  if (!sec.enabled) {
                    return (
                      <div
                        key={sec.id}
                        style={{
                          background: "rgba(240, 240, 240, 0.4)",
                          border: "1px dashed #ccc",
                          borderRadius: "var(--radius-md)",
                          padding: "0.5rem 0.75rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          opacity: 0.6,
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "#888", fontStyle: "italic" }}>
                          [Área #{idx + 1} Oculta: {sec.title}]
                        </span>
                        <EyeOff size={12} color="#999" />
                      </div>
                    );
                  }

                  switch (sec.key) {
                    case "countdown":
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid rgba(212, 169, 89, 0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.65rem 0.75rem",
                            textAlign: "center",
                          }}
                        >
                          <span style={{ fontSize: "0.62rem", color: "var(--color-gold-deep)", fontWeight: 700, letterSpacing: "0.08em" }}>
                            ⏱ #{idx + 1} CONTAGEM REGRESSIVA REAL
                          </span>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(4, 1fr)",
                              gap: "4px",
                              marginTop: "4px",
                            }}
                          >
                            {["DIAS", "HORAS", "MIN", "SEG"].map((label) => (
                              <div
                                key={label}
                                style={{
                                  background: "rgba(212, 169, 89, 0.1)",
                                  padding: "3px 0",
                                  borderRadius: "4px",
                                  fontSize: "0.62rem",
                                  fontWeight: 700,
                                  color: "var(--color-text)",
                                }}
                              >
                                00<br />
                                <span style={{ fontSize: "0.5rem", color: "var(--color-text-soft)" }}>{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );

                    case "welcome":
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid rgba(212, 169, 89, 0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.65rem 0.75rem",
                          }}
                        >
                          <span style={{ fontSize: "0.62rem", color: "var(--color-gold-deep)", fontWeight: 700, letterSpacing: "0.08em", display: "block" }}>
                            👑 #{idx + 1} {sec.title.toUpperCase()}
                          </span>
                          <p style={{ fontSize: "0.7rem", color: "var(--color-text-soft)", margin: "4px 0 0 0", fontStyle: "italic" }}>
                            “{config.welcomeTitle} — {config.welcomeSubtitle.slice(0, 55)}...”
                          </p>
                        </div>
                      );

                    case "details":
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid rgba(212, 169, 89, 0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.65rem 0.75rem",
                          }}
                        >
                          <span style={{ fontSize: "0.62rem", color: "var(--color-gold-deep)", fontWeight: 700, letterSpacing: "0.08em", display: "block" }}>
                            📍 #{idx + 1} LOCALIZAÇÃO & MAPA INTERATIVO
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27ae60" }} />
                            <span style={{ fontSize: "0.68rem", color: "var(--color-text)" }}>
                              Buffet Espaço Real • GPS & Rota Waze/Maps
                            </span>
                          </div>
                        </div>
                      );

                    case "gifts":
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid rgba(212, 169, 89, 0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.65rem 0.75rem",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.62rem", color: "var(--color-gold-deep)", fontWeight: 700, letterSpacing: "0.08em" }}>
                              🎁 #{idx + 1} BOUTIQUE DE MIMOS
                            </span>
                            <span style={{ fontSize: "0.6rem", color: config.pixEnabled ? "#27ae60" : "#888", fontWeight: 700 }}>
                              {config.pixEnabled ? "PIX: Ativado" : "PIX: Desativado"}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "4px", marginTop: "6px", overflowX: "auto" }}>
                            {config.giftItems.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  background: "rgba(255, 240, 245, 0.5)",
                                  border: "1px solid rgba(212, 169, 89, 0.2)",
                                  borderRadius: "4px",
                                  padding: "4px 6px",
                                  fontSize: "0.6rem",
                                  whiteSpace: "nowrap",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                {renderNamedIcon(item.icon, 11, "var(--color-gold-deep)")}
                                <span>{item.title.slice(0, 14)}...</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );

                    case "rsvp":
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid rgba(212, 169, 89, 0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.65rem 0.75rem",
                          }}
                        >
                          <span style={{ fontSize: "0.62rem", color: "var(--color-gold-deep)", fontWeight: 700, letterSpacing: "0.08em", display: "block" }}>
                            💌 #{idx + 1} CONFIRMAÇÃO DE PRESENÇA (R.S.V.P.)
                          </span>
                          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                            <div style={{ flex: 1, padding: "3px", background: "rgba(39, 174, 96, 0.1)", borderRadius: "4px", textAlign: "center", fontSize: "0.6rem", color: "#1e7e34", fontWeight: 700 }}>
                              ✓ Sim, irei
                            </div>
                            <div style={{ flex: 1, padding: "3px", background: "#f5f5f5", borderRadius: "4px", textAlign: "center", fontSize: "0.6rem", color: "#888" }}>
                              Não poderei
                            </div>
                          </div>
                        </div>
                      );

                    case "memories":
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid rgba(212, 169, 89, 0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.65rem 0.75rem",
                          }}
                        >
                          <span style={{ fontSize: "0.62rem", color: "var(--color-gold-deep)", fontWeight: 700, letterSpacing: "0.08em", display: "block" }}>
                            📸 #{idx + 1} ÁLBUM POLAROID VINTAGE
                          </span>
                          <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                            <div style={{ width: "38px", height: "46px", background: "#f8f8f8", border: "1px solid #ddd", borderRadius: "2px", transform: "rotate(-2deg)" }} />
                            <div style={{ width: "38px", height: "46px", background: "#f8f8f8", border: "1px solid #ddd", borderRadius: "2px", transform: "rotate(2deg)" }} />
                            <div style={{ width: "38px", height: "46px", background: "#f8f8f8", border: "1px solid #ddd", borderRadius: "2px", transform: "rotate(-1deg)" }} />
                          </div>
                        </div>
                      );

                    case "capsule":
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid rgba(212, 169, 89, 0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.65rem 0.75rem",
                          }}
                        >
                          <span style={{ fontSize: "0.62rem", color: "var(--color-gold-deep)", fontWeight: 700, letterSpacing: "0.08em", display: "block" }}>
                            💖 #{idx + 1} CÁPSULA DO TEMPO & RECADOS
                          </span>
                          <p style={{ fontSize: "0.65rem", color: "var(--color-text-soft)", margin: "4px 0 0 0" }}>
                            Mural de bilhetes para a Maytê ler no futuro ✨
                          </p>
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 2: BOUTIQUE DE MIMOS, CATEGORIAS & FUNÇÃO PIX
      ========================================================================= */}
      {activeSubTab === "boutique" && (
        <div>
          {/* Card Nobre: ATIVAR / DESATIVAR FUNÇÃO PIX */}
          <div
            style={{
              background: config.pixEnabled
                ? "linear-gradient(135deg, rgba(212, 169, 89, 0.15) 0%, rgba(255, 240, 245, 0.4) 100%)"
                : "rgba(240, 240, 240, 0.6)",
              border: config.pixEnabled
                ? "2px solid var(--color-gold)"
                : "2px dashed #ccc",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.75rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-full)",
                  background: config.pixEnabled ? "var(--color-gold-deep)" : "#999",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QrCode size={22} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ fontSize: "1.1rem", color: "var(--color-text)", fontFamily: "var(--font-serif)" }}>
                    Função de Mimo Real via PIX
                  </strong>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      background: config.pixEnabled ? "#27ae60" : "#777",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {config.pixEnabled ? "ATIVADA NO CONVITE ✓" : "DESATIVADA"}
                  </span>
                </div>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.84rem", color: "var(--color-text-soft)" }}>
                  {config.pixEnabled
                    ? "Os convidados visualizam o card oficial de PIX com QR Code e botão de cópia na Boutique e no formulário."
                    : "A chave PIX, QR Code e sugestões monetárias estão totalmente ocultas para todos os convidados."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  pixEnabled: !prev.pixEnabled,
                }))
              }
              className={config.pixEnabled ? "btn-floral-gold" : "btn-rsvp-decline"}
              style={{
                minWidth: "180px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: 700,
              }}
            >
              {config.pixEnabled ? (
                <>
                  <EyeOff size={16} />
                  <span>Desativar PIX</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Ativar PIX no Convite</span>
                </>
              )}
            </button>
          </div>

          {/* Gerenciador de Categorias de Mimos */}
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.85rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.3rem",
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  Categorias de Mimos da Boutique
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "var(--color-text-soft)" }}>
                  Crie e personalize as abas da boutique (escolha nome, ícone nobre e descrição).
                </p>
              </div>
              <button
                type="button"
                onClick={addGiftCategory}
                className="btn-add-companion"
              >
                <Plus size={14} /> + Nova Categoria
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {config.giftCategories.map((cat, catIdx) => (
                <div
                  key={cat.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(212, 169, 89, 0.35)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Botão Seletor de Ícone */}
                    <button
                      type="button"
                      onClick={() => setIconPickerTarget({ type: "category", id: cat.id })}
                      title="Clique para alterar o ícone desta categoria"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "rgba(212, 169, 89, 0.15)",
                        border: "1px solid var(--color-gold)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "var(--color-gold-deep)",
                      }}
                    >
                      {renderNamedIcon(cat.icon, 18, "var(--color-gold-deep)")}
                    </button>

                    <input
                      type="text"
                      className="rsvp-field-input"
                      style={{ flex: 1, fontWeight: 700, padding: "0.4rem 0.6rem" }}
                      value={cat.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          giftCategories: prev.giftCategories.map((c, i) =>
                            i === catIdx ? { ...c, name: val } : c
                          ),
                        }));
                      }}
                      placeholder="Nome da Categoria..."
                    />

                    {config.giftCategories.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            giftCategories: prev.giftCategories.filter((_, i) => i !== catIdx),
                          }))
                        }
                        className="btn-remove-companion"
                        title="Remover Categoria"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    className="rsvp-field-input"
                    style={{ fontSize: "0.8rem", padding: "0.35rem 0.6rem" }}
                    value={cat.description || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((prev) => ({
                        ...prev,
                        giftCategories: prev.giftCategories.map((c, i) =>
                          i === catIdx ? { ...c, description: val } : c
                        ),
                      }));
                    }}
                    placeholder="Descrição da categoria (ex: Fraldas P, M, G)..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gerenciador de Itens de Mimos da Boutique */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.85rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.3rem",
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  Itens da Vitrine de Presentes
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "var(--color-text-soft)" }}>
                  Arraste os mimos para escolher a ordem na vitrine. Escolha o ícone nobre, a categoria e destaque.
                </p>
              </div>
              <button type="button" onClick={addBoutiqueGift} className="btn-add-companion">
                <Plus size={14} /> + Novo Mimo da Boutique
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {config.giftItems.map((gift, idx) => (
                <div
                  key={gift.id}
                  draggable
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(idx);
                  }}
                  onDrop={() => {
                    if (dragIndex !== null) {
                      setConfig((prev) => ({
                        ...prev,
                        giftItems: reorderList(prev.giftItems, dragIndex, idx),
                      }));
                    }
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={`admin-draggable-card ${dragOverIndex === idx ? "is-drag-over" : ""} ${!gift.enabled ? "is-muted-card" : ""}`}
                >
                  <div className="admin-draggable-row" style={{ alignItems: "flex-start" }}>
                    <button type="button" className="drag-handle" aria-label="Arrastar mimo" style={{ marginTop: "8px" }}>
                      <GripVertical size={18} />
                    </button>

                    {/* Botão Seletor de Ícone do Mimo */}
                    <button
                      type="button"
                      onClick={() => setIconPickerTarget({ type: "gift", id: gift.id })}
                      title="Clique para escolher o ícone deste mimo"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: "rgba(212, 169, 89, 0.15)",
                        border: "1px solid var(--color-gold)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "var(--color-gold-deep)",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {renderNamedIcon(gift.icon, 20, "var(--color-gold-deep)")}
                    </button>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <input
                          type="text"
                          className="rsvp-field-input"
                          style={{ flex: 2, fontWeight: 700 }}
                          value={gift.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              giftItems: prev.giftItems.map((g, i) =>
                                i === idx ? { ...g, title: val } : g
                              ),
                            }));
                          }}
                          placeholder="Título do mimo (ex: Fralda Tam. M + Lenços)..."
                        />

                        {/* Seletor de Categoria Vinculada */}
                        <select
                          className="rsvp-field-input"
                          style={{ flex: 1, minWidth: "150px" }}
                          value={gift.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              giftItems: prev.giftItems.map((g, i) =>
                                i === idx ? { ...g, category: val } : g
                              ),
                            }));
                          }}
                        >
                          {config.giftCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="text"
                        className="rsvp-field-input"
                        value={gift.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: prev.giftItems.map((g, i) =>
                              i === idx ? { ...g, description: val } : g
                            ),
                          }));
                        }}
                        placeholder="Descrição ou sugestão de marca/tamanho..."
                      />
                    </div>

                    <div className="admin-draggable-actions">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: prev.giftItems.map((g, i) =>
                              i === idx ? { ...g, highlight: !g.highlight } : g
                            ),
                          }))
                        }
                        className="btn-icon-royal"
                        title={gift.highlight ? "Mimo em Destaque" : "Destacar Mimo"}
                      >
                        <Star
                          size={15}
                          color={gift.highlight ? "#d4af37" : "#aaa"}
                          fill={gift.highlight ? "#d4af37" : "none"}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: reorderList(prev.giftItems, idx, idx - 1),
                          }))
                        }
                        disabled={idx === 0}
                        className="btn-icon-royal"
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: reorderList(prev.giftItems, idx, idx + 1),
                          }))
                        }
                        disabled={idx === config.giftItems.length - 1}
                        className="btn-icon-royal"
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: prev.giftItems.map((g, i) =>
                              i === idx ? { ...g, enabled: !g.enabled } : g
                            ),
                          }))
                        }
                        className="btn-icon-royal"
                        title={gift.enabled ? "Mimo Ativo" : "Mimo Oculto"}
                      >
                        {gift.enabled ? <Eye size={16} color="#27ae60" /> : <EyeOff size={16} color="#999" />}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: prev.giftItems.filter((_, i) => i !== idx),
                          }))
                        }
                        className="btn-remove-companion"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 3: PERGUNTAS DO RSVP
      ========================================================================= */}
      {activeSubTab === "questions" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
              Crie perguntas personalizadas (texto livre ou pílulas de escolha) que aparecem dentro do Cartão de Resposta Real (R.S.V.P.).
            </p>
            <button type="button" onClick={addCustomQuestion} className="btn-add-companion">
              <Plus size={14} /> + Nova Pergunta
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {config.customQuestions.map((q, idx) => (
              <div
                key={q.id}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(idx);
                }}
                onDrop={() => {
                  if (dragIndex !== null) {
                    setConfig((prev) => ({
                      ...prev,
                      customQuestions: reorderList(prev.customQuestions, dragIndex, idx),
                    }));
                  }
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                className={`admin-draggable-card ${dragOverIndex === idx ? "is-drag-over" : ""} ${!q.enabled ? "is-muted-card" : ""}`}
              >
                <div className="admin-draggable-row" style={{ alignItems: "flex-start" }}>
                  <button type="button" className="drag-handle" aria-label="Arrastar pergunta" style={{ marginTop: "8px" }}>
                    <GripVertical size={18} />
                  </button>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      type="text"
                      className="rsvp-field-input"
                      style={{ fontWeight: 700 }}
                      value={q.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: prev.customQuestions.map((it, i) =>
                            i === idx ? { ...it, label: val } : it
                          ),
                        }));
                      }}
                      placeholder="Pergunta para os convidados..."
                    />

                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                      <select
                        className="rsvp-field-input"
                        style={{ maxWidth: "200px" }}
                        value={q.type}
                        onChange={(e) => {
                          const val = e.target.value as "TEXT" | "SELECT_PILLS";
                          setConfig((prev) => ({
                            ...prev,
                            customQuestions: prev.customQuestions.map((it, i) =>
                              i === idx ? { ...it, type: val } : it
                            ),
                          }));
                        }}
                      >
                        <option value="TEXT">Resposta em Texto</option>
                        <option value="SELECT_PILLS">Pílulas de Seleção</option>
                      </select>

                      <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--color-text)", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setConfig((prev) => ({
                              ...prev,
                              customQuestions: prev.customQuestions.map((it, i) =>
                                i === idx ? { ...it, required: checked } : it
                              ),
                            }));
                          }}
                        />
                        <span>Obrigatória</span>
                      </label>
                    </div>

                    {q.type === "SELECT_PILLS" && (
                      <input
                        type="text"
                        className="rsvp-field-input"
                        placeholder="Opções separadas por vírgula (Ex: Sem Lactose, Vegetariano, Sem Glúten)"
                        value={(q.options || []).join(", ")}
                        onChange={(e) => {
                          const opts = e.target.value.split(",").map((s) => s.trim());
                          setConfig((prev) => ({
                            ...prev,
                            customQuestions: prev.customQuestions.map((it, i) =>
                              i === idx ? { ...it, options: opts } : it
                            ),
                          }));
                        }}
                      />
                    )}
                  </div>

                  <div className="admin-draggable-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: reorderList(prev.customQuestions, idx, idx - 1),
                        }))
                      }
                      disabled={idx === 0}
                      className="btn-icon-royal"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: reorderList(prev.customQuestions, idx, idx + 1),
                        }))
                      }
                      disabled={idx === config.customQuestions.length - 1}
                      className="btn-icon-royal"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: prev.customQuestions.map((it, i) =>
                            i === idx ? { ...it, enabled: !it.enabled } : it
                          ),
                        }))
                      }
                      className="btn-icon-royal"
                      title={q.enabled ? "Pergunta Ativa" : "Pergunta Oculta"}
                    >
                      {q.enabled ? <Eye size={16} color="#27ae60" /> : <EyeOff size={16} color="#999" />}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: prev.customQuestions.filter((_, i) => i !== idx),
                        }))
                      }
                      className="btn-remove-companion"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 4: MIMOS RÁPIDOS DO RSVP
      ========================================================================= */}
      {activeSubTab === "rsvpMimos" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
              Sugestões rápidas de fraldas ou mimos exibidas em formato de botões 2x2 dentro do formulário de presença.
            </p>
            <button type="button" onClick={addQuickMimo} className="btn-add-companion">
              <Plus size={14} /> + Novo Mimo Rápido
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {config.rsvpQuickMimos.map((qm, idx) => (
              <div
                key={qm.id}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(idx);
                }}
                onDrop={() => {
                  if (dragIndex !== null) {
                    setConfig((prev) => ({
                      ...prev,
                      rsvpQuickMimos: reorderList(prev.rsvpQuickMimos, dragIndex, idx),
                    }));
                  }
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                className={`admin-draggable-card ${dragOverIndex === idx ? "is-drag-over" : ""} ${!qm.enabled ? "is-muted-card" : ""}`}
              >
                <div className="admin-draggable-row">
                  <button type="button" className="drag-handle" aria-label="Arrastar mimo rápido">
                    <GripVertical size={18} />
                  </button>

                  <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
                    <input
                      type="text"
                      className="rsvp-field-input"
                      style={{ flex: 1, fontWeight: 700 }}
                      value={qm.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          rsvpQuickMimos: prev.rsvpQuickMimos.map((it, i) =>
                            i === idx ? { ...it, label: val } : it
                          ),
                        }));
                      }}
                      placeholder="Nome do mimo (Ex: Fralda Tam. G + Pomada)..."
                    />
                    <input
                      type="text"
                      className="rsvp-field-input"
                      style={{ flex: 1 }}
                      value={qm.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          rsvpQuickMimos: prev.rsvpQuickMimos.map((it, i) =>
                            i === idx ? { ...it, category: val } : it
                          ),
                        }));
                      }}
                      placeholder="Subtítulo (Ex: Super Útil 👑)..."
                    />
                  </div>

                  <div className="admin-draggable-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          rsvpQuickMimos: reorderList(prev.rsvpQuickMimos, idx, idx - 1),
                        }))
                      }
                      disabled={idx === 0}
                      className="btn-icon-royal"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          rsvpQuickMimos: reorderList(prev.rsvpQuickMimos, idx, idx + 1),
                        }))
                      }
                      disabled={idx === config.rsvpQuickMimos.length - 1}
                      className="btn-icon-royal"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          rsvpQuickMimos: prev.rsvpQuickMimos.map((it, i) =>
                            i === idx ? { ...it, enabled: !it.enabled } : it
                          ),
                        }))
                      }
                      className="btn-icon-royal"
                    >
                      {qm.enabled ? <Eye size={16} color="#27ae60" /> : <EyeOff size={16} color="#999" />}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          rsvpQuickMimos: prev.rsvpQuickMimos.filter((_, i) => i !== idx),
                        }))
                      }
                      className="btn-remove-companion"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 5: FRASES CÁPSULA DO TEMPO
      ========================================================================= */}
      {activeSubTab === "inspirations" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
              Sugestões carinhosas que ajudam os convidados a escreverem na Cápsula do Tempo da Maytê.
            </p>
            <button type="button" onClick={addInspirationQuote} className="btn-add-companion">
              <Plus size={14} /> + Nova Frase
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {config.inspirationQuotes.map((iq, idx) => (
              <div
                key={iq.id}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(idx);
                }}
                onDrop={() => {
                  if (dragIndex !== null) {
                    setConfig((prev) => ({
                      ...prev,
                      inspirationQuotes: reorderList(prev.inspirationQuotes, dragIndex, idx),
                    }));
                  }
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                className={`admin-draggable-card ${dragOverIndex === idx ? "is-drag-over" : ""}`}
              >
                <div className="admin-draggable-row">
                  <button type="button" className="drag-handle" aria-label="Arrastar frase">
                    <GripVertical size={18} />
                  </button>
                  <input
                    type="text"
                    className="rsvp-field-input"
                    style={{ flex: 1 }}
                    value={iq.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((prev) => ({
                        ...prev,
                        inspirationQuotes: prev.inspirationQuotes.map((it, i) =>
                          i === idx ? { ...it, text: val } : it
                        ),
                      }));
                    }}
                  />
                  <div className="admin-draggable-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          inspirationQuotes: reorderList(prev.inspirationQuotes, idx, idx - 1),
                        }))
                      }
                      disabled={idx === 0}
                      className="btn-icon-royal"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          inspirationQuotes: reorderList(prev.inspirationQuotes, idx, idx + 1),
                        }))
                      }
                      disabled={idx === config.inspirationQuotes.length - 1}
                      className="btn-icon-royal"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          inspirationQuotes: prev.inspirationQuotes.filter((_, i) => i !== idx),
                        }))
                      }
                      className="btn-remove-companion"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 6: BÊNÇÃOS DA COROA
      ========================================================================= */}
      {activeSubTab === "crown" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
              Frases mágicas que se alternam quando o convidado toca ou clica na Coroa Real 3D no topo do convite.
            </p>
            <button type="button" onClick={addCrownBlessing} className="btn-add-companion">
              <Plus size={14} /> + Nova Bênção da Coroa
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {config.crownBlessings.map((cb, idx) => (
              <div
                key={cb.id}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(idx);
                }}
                onDrop={() => {
                  if (dragIndex !== null) {
                    setConfig((prev) => ({
                      ...prev,
                      crownBlessings: reorderList(prev.crownBlessings, dragIndex, idx),
                    }));
                  }
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                className={`admin-draggable-card ${dragOverIndex === idx ? "is-drag-over" : ""}`}
              >
                <div className="admin-draggable-row">
                  <button type="button" className="drag-handle" aria-label="Arrastar bênção da coroa">
                    <GripVertical size={18} />
                  </button>
                  <input
                    type="text"
                    className="rsvp-field-input"
                    style={{ flex: 1 }}
                    value={cb.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((prev) => ({
                        ...prev,
                        crownBlessings: prev.crownBlessings.map((it, i) =>
                          i === idx ? { ...it, text: val } : it
                        ),
                      }));
                    }}
                  />
                  <div className="admin-draggable-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          crownBlessings: reorderList(prev.crownBlessings, idx, idx - 1),
                        }))
                      }
                      disabled={idx === 0}
                      className="btn-icon-royal"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          crownBlessings: reorderList(prev.crownBlessings, idx, idx + 1),
                        }))
                      }
                      disabled={idx === config.crownBlessings.length - 1}
                      className="btn-icon-royal"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          crownBlessings: prev.crownBlessings.filter((_, i) => i !== idx),
                        }))
                      }
                      className="btn-remove-companion"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL SELETOR DE ÍCONES NOBRES
      ========================================================================= */}
      {iconPickerTarget && (
        <div
          className="modal-backdrop"
          onClick={() => setIconPickerTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Escolher Ícone Real"
        >
          <div
            className="floral-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "420px", padding: "1.5rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} color="var(--color-gold-deep)" />
                <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--color-text)" }}>
                  Escolher Ícone Real
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIconPickerTarget(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-soft)" }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--color-text-soft)", margin: "0 0 1rem 0" }}>
              Toque no ícone desejado para vincular com elegância ao item:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.65rem",
              }}
            >
              {AVAILABLE_ICONS.map((iconItem) => {
                const IconComponent = iconItem.icon;
                return (
                  <button
                    key={iconItem.name}
                    type="button"
                    onClick={() => {
                      if (iconPickerTarget.type === "category") {
                        setConfig((prev) => ({
                          ...prev,
                          giftCategories: prev.giftCategories.map((c) =>
                            c.id === iconPickerTarget.id ? { ...c, icon: iconItem.name } : c
                          ),
                        }));
                      } else {
                        setConfig((prev) => ({
                          ...prev,
                          giftItems: prev.giftItems.map((g) =>
                            g.id === iconPickerTarget.id ? { ...g, icon: iconItem.name } : g
                          ),
                        }));
                      }
                      setIconPickerTarget(null);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(212, 169, 89, 0.35)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.75rem 0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-gold)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(212, 169, 89, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(212, 169, 89, 0.35)";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <IconComponent size={22} color="var(--color-gold-deep)" />
                    <span style={{ fontSize: "0.68rem", color: "var(--color-text)", fontWeight: 600, textAlign: "center" }}>
                      {iconItem.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
