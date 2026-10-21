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
} from "lucide-react";
import {
  mergePortalDynamicConfig,
  type PortalDynamicConfig,
  type DraggableCustomQuestion,
} from "../../../config/portalConfig";
import { updateAdminEventSettings } from "../../../lib/adminApi";
import { RoyalCornerFiligree } from "../../../components/brand/RoyalOrnaments";

interface PortalBuilderTabProps {
  token: string;
  initialPortalConfig?: Partial<PortalDynamicConfig> | null;
  onSaved: () => void;
}

type BuilderSectionKey =
  | "questions"
  | "rsvpMimos"
  | "boutique"
  | "inspirations"
  | "crown"
  | "sections";

export const PortalBuilderTab: React.FC<PortalBuilderTabProps> = ({
  token,
  initialPortalConfig,
  onSaved,
}) => {
  const [config, setConfig] = useState<PortalDynamicConfig>(() =>
    mergePortalDynamicConfig(initialPortalConfig)
  );
  const [activeSubTab, setActiveSubTab] = useState<BuilderSectionKey>("questions");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Generic reorder helper for both Drag-and-Drop and Keyboard/Button arrows
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

  // Add new items helpers
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

  const addBoutiqueGift = () => {
    setConfig((prev) => ({
      ...prev,
      giftItems: [
        ...prev.giftItems,
        {
          id: `gift_${Date.now()}`,
          title: "Novo Mimo da Boutique",
          category: "Enxoval Real",
          description: "Descrição carinhosa da sugestão para a Maytê.",
          highlight: false,
          enabled: true,
        },
      ],
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
            Arraste pela alça dourada (<strong>⋮⋮</strong>) ou use as setas para reordenar perguntas, mimos, frases e seções do portal.
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
          { id: "questions", label: `Perguntas do RSVP (${config.customQuestions.length})`, icon: HelpCircle },
          { id: "rsvpMimos", label: `Mimos Rápidos RSVP (${config.rsvpQuickMimos.length})`, icon: Gift },
          { id: "boutique", label: `Boutique de Mimos (${config.giftItems.length})`, icon: Sparkles },
          { id: "inspirations", label: `Frases Cápsula (${config.inspirationQuotes.length})`, icon: MessageSquareHeart },
          { id: "crown", label: `Bênçãos da Coroa (${config.crownBlessings.length})`, icon: Crown },
          { id: "sections", label: "Ordem das Seções", icon: Layers },
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

      {/* 1. PERGUNTAS PERSONALIZADAS DO FORMULÁRIO RSVP */}
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
                <div className="admin-draggable-row">
                  <button
                    type="button"
                    className="drag-handle"
                    aria-label="Arraste ou use as setas para mover esta pergunta"
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: reorderList(prev.customQuestions, idx, idx - 1),
                        }));
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: reorderList(prev.customQuestions, idx, idx + 1),
                        }));
                      }
                    }}
                  >
                    <GripVertical size={18} />
                  </button>

                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                    <div>
                      <label className="rsvp-field-label">Título da Pergunta</label>
                      <input
                        type="text"
                        className="rsvp-field-input"
                        value={q.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            customQuestions: prev.customQuestions.map((item, i) =>
                              i === idx ? { ...item, label: val } : item
                            ),
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="rsvp-field-label">Tipo de Campo</label>
                      <div className="royal-companion-type-pills" style={{ marginTop: "4px" }}>
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              customQuestions: prev.customQuestions.map((item, i) =>
                                i === idx ? { ...item, type: "TEXT" } : item
                              ),
                            }))
                          }
                          className={`companion-type-pill ${q.type === "TEXT" ? "is-active" : ""}`}
                        >
                          Texto Livre
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              customQuestions: prev.customQuestions.map((item, i) =>
                                i === idx ? { ...item, type: "SELECT_PILLS" } : item
                              ),
                            }))
                          }
                          className={`companion-type-pill ${q.type === "SELECT_PILLS" ? "is-active" : ""}`}
                        >
                          Pílulas de Escolha
                        </button>
                      </div>
                    </div>

                    {q.type === "SELECT_PILLS" ? (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label className="rsvp-field-label">Opções (separadas por vírgula)</label>
                        <input
                          type="text"
                          className="rsvp-field-input"
                          value={(q.options || []).join(", ")}
                          placeholder="Ex: Nenhuma, Sem Lactose, Vegetariano"
                          onChange={(e) => {
                            const opts = e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean);
                            setConfig((prev) => ({
                              ...prev,
                              customQuestions: prev.customQuestions.map((item, i) =>
                                i === idx ? { ...item, options: opts } : item
                              ),
                            }));
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label className="rsvp-field-label">Texto de Exemplo (Placeholder)</label>
                        <input
                          type="text"
                          className="rsvp-field-input"
                          value={q.placeholder || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              customQuestions: prev.customQuestions.map((item, i) =>
                                i === idx ? { ...item, placeholder: val } : item
                              ),
                            }));
                          }}
                        />
                      </div>
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
                      title="Subir"
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
                      title="Descer"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          customQuestions: prev.customQuestions.map((item, i) =>
                            i === idx ? { ...item, enabled: !item.enabled } : item
                          ),
                        }))
                      }
                      className="btn-icon-royal"
                      title={q.enabled ? "Visível no formulário" : "Oculto"}
                    >
                      {q.enabled ? <Eye size={15} color="#27ae60" /> : <EyeOff size={15} color="#999" />}
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
                      title="Remover pergunta"
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

      {/* 2. MIMOS RÁPIDOS DO RSVP (GRADE 2x2) */}
      {activeSubTab === "rsvpMimos" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
              Ordene e edite os mini-cards rápidos de Fralda/Mimo exibidos dentro do formulário de confirmação.
            </p>
            <button type="button" onClick={addQuickMimo} className="btn-add-companion">
              <Plus size={14} /> + Novo Card Rápido
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {config.rsvpQuickMimos.map((mimo, idx) => (
              <div
                key={mimo.id}
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
                className={`admin-draggable-card ${dragOverIndex === idx ? "is-drag-over" : ""} ${!mimo.enabled ? "is-muted-card" : ""}`}
              >
                <div className="admin-draggable-row">
                  <button type="button" className="drag-handle" aria-label="Arrastar mimo rápido">
                    <GripVertical size={18} />
                  </button>

                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                    <div>
                      <label className="rsvp-field-label">Selo / Categoria</label>
                      <input
                        type="text"
                        className="rsvp-field-input"
                        value={mimo.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            rsvpQuickMimos: prev.rsvpQuickMimos.map((it, i) =>
                              i === idx ? { ...it, category: val } : it
                            ),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="rsvp-field-label">Título do Mimo / Fralda</label>
                      <input
                        type="text"
                        className="rsvp-field-input"
                        value={mimo.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            rsvpQuickMimos: prev.rsvpQuickMimos.map((it, i) =>
                              i === idx ? { ...it, label: val } : it
                            ),
                          }));
                        }}
                      />
                    </div>
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
                      {mimo.enabled ? <Eye size={15} color="#27ae60" /> : <EyeOff size={15} color="#999" />}
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

      {/* 3. VITRINE DA BOUTIQUE DE MIMOS & FRALDAS */}
      {activeSubTab === "boutique" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
              Arraste os cards para definir a prioridade na Boutique Real de Mimos & Fraldas.
            </p>
            <button type="button" onClick={addBoutiqueGift} className="btn-add-companion">
              <Plus size={14} /> + Novo Item na Boutique
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
                <div className="admin-draggable-row">
                  <button type="button" className="drag-handle" aria-label="Arrastar item da boutique">
                    <GripVertical size={18} />
                  </button>

                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                    <div>
                      <label className="rsvp-field-label">Título do Presente / Fralda</label>
                      <input
                        type="text"
                        className="rsvp-field-input"
                        value={gift.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: prev.giftItems.map((it, i) =>
                              i === idx ? { ...it, title: val } : it
                            ),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="rsvp-field-label">Faixa Etária / Tag</label>
                      <input
                        type="text"
                        className="rsvp-field-input"
                        value={gift.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: prev.giftItems.map((it, i) =>
                              i === idx ? { ...it, category: val } : it
                            ),
                          }));
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label className="rsvp-field-label">Descrição Carinhosa</label>
                      <input
                        type="text"
                        className="rsvp-field-input"
                        value={gift.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            giftItems: prev.giftItems.map((it, i) =>
                              i === idx ? { ...it, description: val } : it
                            ),
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-draggable-actions">
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
                          giftItems: prev.giftItems.map((it, i) =>
                            i === idx ? { ...it, enabled: !it.enabled } : it
                          ),
                        }))
                      }
                      className="btn-icon-royal"
                    >
                      {gift.enabled ? <Eye size={15} color="#27ae60" /> : <EyeOff size={15} color="#999" />}
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
      )}

      {/* 4. FRASES DE INSPIRAÇÃO 1-TOQUE DA CÁPSULA */}
      {activeSubTab === "inspirations" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
              Personalize as pílulas de sugestão de mensagem que ajudam os convidados a preencher a Cápsula do Tempo com 1 toque.
            </p>
            <button type="button" onClick={addInspirationQuote} className="btn-add-companion">
              <Plus size={14} /> + Nova Frase de Inspiração
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

      {/* 5. BÊNÇÃOS INTERATIVAS DA COROA REAL 3D */}
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

      {/* 6. ORDEM & VISIBILIDADE DAS SEÇÕES DO PORTAL */}
      {activeSubTab === "sections" && (
        <div>
          <p style={{ margin: "0 0 1rem 0", fontSize: "0.88rem", color: "var(--color-text-soft)" }}>
            Arraste para escolher a ordem exata em que as seções aparecem no convite da Maytê, ou ative/oculte qualquer seção com o ícone de olho.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {config.portalSections.map((sec, idx) => (
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
              >
                <div className="admin-draggable-row">
                  <button type="button" className="drag-handle" aria-label="Arrastar seção do portal">
                    <GripVertical size={18} />
                  </button>

                  <div style={{ flex: 1 }}>
                    <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "var(--color-text)", display: "block" }}>
                      {idx + 1}. {sec.title}
                    </strong>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-soft)" }}>
                      {sec.subtitle}
                    </span>
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
                      title={sec.enabled ? "Seção Ativa" : "Seção Oculta"}
                    >
                      {sec.enabled ? <Eye size={16} color="#27ae60" /> : <EyeOff size={16} color="#999" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
