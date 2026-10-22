import React, { useState, useRef, useMemo } from "react";
import {
  Camera,
  X,
  CheckCircle2,
  Sparkles,
  Heart,
  MessageSquareHeart,
  Send,
  ImagePlus,
  User,
  LayoutGrid,
  Columns,
  Film,
  Tag,
  ZoomIn,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../brand/RoyalOrnaments";
import { invitationContent } from "../../config/invitationContent";
import {
  POLAROID_CATEGORIES,
  SEED_VINTAGE_POLAROIDS,
  formatPolaroidCaptionWithCategory,
  parsePolaroidCaption,
  type PolaroidCategoryKey,
  type VintagePolaroidItem,
} from "../../config/portalConfig";
import { useEventContext } from "../../context/EventContext";

type AlbumGridMode = "vintage" | "grid-3" | "grid-2";

export interface MemoriesSectionProps {
  variant?: "all" | "memories" | "capsule";
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ variant = "all" }) => {
  const { memories } = invitationContent.sections;
  const {
    guestbook,
    addGuestbookMessage,
    eventSettings,
    publicPhotos,
    refreshEventInfo,
    portalConfig,
  } = useEventContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localPolaroids, setLocalPolaroids] = useState<VintagePolaroidItem[]>([]);
  const [photoCaption, setPhotoCaption] = useState("Com amor para a princesa Maytê ✨");
  const [uploadCategory, setUploadCategory] =
    useState<Exclude<PolaroidCategoryKey, "all">>("cha");

  // Album Filter & Grid Organization States
  const [activeCategory, setActiveCategory] = useState<PolaroidCategoryKey>("all");
  const [gridMode, setGridMode] = useState<AlbumGridMode>("vintage");
  const [lightboxPhoto, setLightboxPhoto] = useState<VintagePolaroidItem | null>(null);
  const [newlyDevelopedId, setNewlyDevelopedId] = useState<string | null>(null);

  // Quick Time-Capsule Message Form
  const [authorName, setAuthorName] = useState("");
  const [capsuleMessage, setCapsuleMessage] = useState("");
  const [capsuleSaved, setCapsuleSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Schedule logic: Unlocks on the baby shower date (22/Nov/2026) or manual admin release
  const isCapsuleUnlocked = useMemo(() => {
    if (!portalConfig) return true;
    if (portalConfig.capsuleReleaseMode === "MANUAL_OPEN") return true;
    if (portalConfig.capsuleReleaseMode === "LOCKED") return false;
    const targetTime = new Date(
      portalConfig.capsuleReleaseDateIso || "2026-11-22T00:00:00"
    ).getTime();
    return Date.now() >= targetTime;
  }, [portalConfig]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processSelectedFile = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    const newId = `pol-${Date.now()}`;
    const cleanCap = photoCaption.trim() || "Lembrança Real da Maytê ✨";

    const newItem: VintagePolaroidItem = {
      id: newId,
      url: localUrl,
      caption: cleanCap,
      category: uploadCategory,
      dateStamp: new Date().toLocaleDateString("pt-BR").replace(/\//g, " • "),
      rotationDeg: (Math.random() - 0.5) * 4.2,
    };

    setLocalPolaroids((prev) => [newItem, ...prev]);
    setNewlyDevelopedId(newId);
    setActiveCategory("all");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "caption",
        formatPolaroidCaptionWithCategory(cleanCap, uploadCategory)
      );

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setModalOpen(true);
        refreshEventInfo();
      }
    } catch {
      setModalOpen(true);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await processSelectedFile(file);
    }
  };

  const handleSendCapsuleMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !capsuleMessage.trim()) return;

    addGuestbookMessage(authorName.trim(), capsuleMessage.trim());
    setCapsuleSaved(true);
    setCapsuleMessage("");
    window.setTimeout(() => setCapsuleSaved(false), 3500);
  };

  // Combine uploaded photos + curated vintage seed Polaroids
  const allAlbumPhotos = useMemo<VintagePolaroidItem[]>(() => {
    const fromBackend: VintagePolaroidItem[] = publicPhotos.map((pp, idx) => {
      const parsed = parsePolaroidCaption(pp.caption);
      const angles = [-2.2, 1.8, -1.5, 2.4, -1.9, 1.4];
      return {
        id: pp.id,
        url: pp.url,
        caption: parsed.caption,
        category: parsed.category,
        dateStamp: new Date(pp.createdAt).toLocaleDateString("pt-BR").replace(/\//g, " • "),
        rotationDeg: angles[idx % angles.length] ?? 1.5,
      };
    });

    return [...localPolaroids, ...fromBackend, ...SEED_VINTAGE_POLAROIDS];
  }, [localPolaroids, publicPhotos]);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "all") return allAlbumPhotos;
    return allAlbumPhotos.filter((p) => p.category === activeCategory);
  }, [allAlbumPhotos, activeCategory]);

  const getCategoryLabel = (catKey: Exclude<PolaroidCategoryKey, "all">) => {
    return (
      POLAROID_CATEGORIES.find((c) => c.key === catKey)?.shortBadge || "Chá de Fraldas 👑"
    );
  };

  const showPolaroids = variant === "all" || variant === "memories";
  const showCapsule = variant === "all" || variant === "capsule";

  return (
    <section
      id={variant === "capsule" ? "capsule-section" : "memories-section"}
      className="invitation-section reveal-on-scroll"
      aria-label={variant === "capsule" ? "Cápsula do Tempo" : "Fotos e Recordações"}
    >
      <div className="invitation-container">
        {/* Cabeçalho da Seção */}
        {showPolaroids && (
          <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
            <RoyalCrestOrnament width={190} />
            <span className="section-eyebrow">Memórias & Eternidade</span>
            <h2 className="section-title">{memories.title}</h2>
            <p className="section-subtitle">{memories.description}</p>
          </div>
        )}

        {/* 1. Estúdio Polaroid Vintage (Dropzone + Seletor de Categoria + Galeria por Grade) */}
        {showPolaroids && (
          <div className="memories-interactive-card" style={{ position: "relative" }}>
            <RoyalCornerFiligree position="tl" size={48} />
            <RoyalCornerFiligree position="tr" size={48} />
            <RoyalCornerFiligree position="bl" size={48} />
            <RoyalCornerFiligree position="br" size={48} />

            <div className="memories-camera-badge">
              <Camera size={32} color="var(--color-gold-deep)" />
            </div>

            <h3 className="memories-headline">{memories.headline}</h3>

            <p className="memories-privacy">
              {isCapsuleUnlocked
                ? "Todas as fotos enviadas passam carinhosamente pela aprovação dos papais da Maytê antes de aparecerem no mural."
                : memories.privacyNote}
            </p>

            {/* SE ABERTO: Dropzone Polaroid. SE AGENDADO: Card Nobre de Abertura no Dia do Chá */}
            {isCapsuleUnlocked ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`royal-polaroid-dropzone ${isDragging ? "is-dragging" : ""}`}
              >
                {/* Passo 1: Categoria da Polaroid */}
                <div style={{ marginBottom: "0.95rem" }}>
                  <span
                    className="rsvp-field-label"
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    <Tag size={13} color="var(--color-gold-deep)" />
                    1. Escolha o Álbum / Categoria da sua Polaroid:
                  </span>
                  <div
                    className="polaroid-category-selector-pills"
                    role="radiogroup"
                    aria-label="Categoria da foto"
                  >
                    {POLAROID_CATEGORIES.filter((c) => c.key !== "all").map((cat) => {
                      const selected = uploadCategory === cat.key;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() =>
                            setUploadCategory(cat.key as Exclude<PolaroidCategoryKey, "all">)
                          }
                          className={`polaroid-cat-pill ${selected ? "is-selected" : ""}`}
                        >
                          {selected ? `✓ ${cat.label}` : cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Passo 2: Legenda Manuscrita da Polaroid */}
                <div className="polaroid-caption-field">
                  <label
                    htmlFor="polaroid-caption-input"
                    className="rsvp-field-label"
                    style={{ textAlign: "center", display: "block", marginBottom: "6px" }}
                  >
                    2. Escreva a dedicatória na borda da Polaroid:
                  </label>
                  <div
                    className="royal-input-group"
                    style={{ maxWidth: "440px", margin: "0 auto" }}
                  >
                    <span className="royal-input-icon" aria-hidden="true">
                      <Sparkles size={16} />
                    </span>
                    <input
                      id="polaroid-caption-input"
                      type="text"
                      className="rsvp-field-input with-icon"
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="Ex: Com amor para a princesa Maytê ✨"
                    />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                <div style={{ marginTop: "var(--space-md)" }}>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleButtonClick}
                    className="btn-floral-gold btn-shimmer-gold"
                    aria-label={memories.buttonText}
                  >
                    <ImagePlus size={18} />
                    <span>
                      {uploading
                        ? "Enviando para Aprovação Real..."
                        : memories.buttonText}
                    </span>
                  </button>
                  <span className="polaroid-drop-hint">
                    Toque no botão para abrir a câmera/galeria (fotos passam por moderação dos pais)
                  </span>
                </div>
              </div>
            ) : (
              /* Card Nobre Informativo: Abertura Agendada no Dia do Chá */
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.6) 100%)",
                  border: "2px dashed var(--color-gold)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.75rem 1.25rem",
                  margin: "1.25rem auto",
                  maxWidth: "520px",
                  textAlign: "center",
                  boxShadow: "0 8px 24px rgba(212, 169, 89, 0.12)",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(212, 169, 89, 0.15)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    color: "var(--color-gold-deep)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Clock size={14} />
                  <span>LIBERAÇÃO NO DIA DO CHÁ DE BEBÊ</span>
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.35rem",
                    color: "var(--color-text)",
                    margin: "0.35rem 0 0.5rem 0",
                  }}
                >
                  Eternize um momento para a Maytê!
                </h4>
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "var(--color-text-soft)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {portalConfig?.capsuleReleaseNotice ||
                    "O envio de fotos Polaroid será aberto aos convidados a partir de 22 de Novembro de 2026. Todas as fotos enviadas passarão pela aprovação carinhosa dos papais antes de entrarem para o mural eterno."}
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "0.85rem",
                    fontSize: "0.76rem",
                    color: "#27ae60",
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Moderação Administrativa Ativa • Fotos Seguras</span>
                </div>
              </div>
            )}

            {/* Barra de Organização do Álbum Real: Filtros de Categoria + Seletor de Grade */}
            <div className="polaroid-album-toolbar">
              <div
                className="polaroid-album-categories"
                role="tablist"
                aria-label="Filtrar álbum por categoria"
              >
                {POLAROID_CATEGORIES.map((cat) => {
                  const active = activeCategory === cat.key;
                  const count =
                    cat.key === "all"
                      ? allAlbumPhotos.length
                      : allAlbumPhotos.filter((p) => p.category === cat.key).length;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`boutique-filter-pill ${active ? "is-active" : ""}`}
                    >
                      <span>{cat.label}</span>
                      <span className="polaroid-cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div
                className="polaroid-grid-mode-switcher"
                role="group"
                aria-label="Modo de exibição da grade"
              >
                <button
                  type="button"
                  onClick={() => setGridMode("vintage")}
                  className={`polaroid-grid-btn ${gridMode === "vintage" ? "is-active" : ""}`}
                  title="Varal Antigo Animado"
                >
                  <Film size={14} />
                  <span>Varal Antigo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGridMode("grid-3")}
                  className={`polaroid-grid-btn ${gridMode === "grid-3" ? "is-active" : ""}`}
                  title="Grade Clássica"
                >
                  <LayoutGrid size={14} />
                  <span>Grade</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGridMode("grid-2")}
                  className={`polaroid-grid-btn ${gridMode === "grid-2" ? "is-active" : ""}`}
                  title="Galeria Ampla"
                >
                  <Columns size={14} />
                  <span>Ampla</span>
                </button>
              </div>
            </div>

            {/* Galeria de Polaroids em Estilo Antigo (Vintage Instant Film) */}
            <div
              className={`polaroid-preview-gallery mode-${gridMode}`}
              role="region"
              aria-label="Galeria de Polaroids da Maytê"
            >
              {filteredPhotos.map((p, idx) => {
                const isNew = newlyDevelopedId === p.id;
                return (
                  <figure
                    key={p.id}
                    onClick={() => setLightboxPhoto(p)}
                    className={`royal-polaroid-frame is-vintage-animated ${
                      isNew ? "is-chemical-developing" : ""
                    }`}
                    style={
                      {
                        "--polaroid-tilt":
                          gridMode === "vintage" ? `${p.rotationDeg}deg` : "0deg",
                        "--polaroid-delay": `${(idx % 6) * 0.45}s`,
                      } as React.CSSProperties
                    }
                  >
                    {/* Fita Dourada Vintage no Topo */}
                    <div className="polaroid-vintage-tape" aria-hidden="true" />

                    <div className="royal-polaroid-img-wrap">
                      <img src={p.url} alt={p.caption} loading="lazy" />
                      <div className="polaroid-vintage-vignette" aria-hidden="true" />
                      <span className="polaroid-zoom-badge" aria-hidden="true">
                        <ZoomIn size={13} />
                      </span>
                    </div>

                    <div className="polaroid-vintage-meta">
                      <span className="polaroid-vintage-cat-tag">
                        {getCategoryLabel(p.category)}
                      </span>
                      <span className="polaroid-vintage-date-stamp">
                        {p.dateStamp}
                      </span>
                    </div>

                    <figcaption className="royal-polaroid-caption">
                      “{p.caption}”
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Cápsula do Tempo da Maytê — Mural de Carinho ao Vivo */}
        {showCapsule && (
          <div className="time-capsule-wrapper" style={{ marginTop: showPolaroids ? "2.5rem" : "0" }}>
            <div className="time-capsule-header">
              <span className="section-eyebrow">
                <MessageSquareHeart size={13} />
                Mural de Amor
              </span>
              <h3 className="time-capsule-title">
                Cápsula do Tempo da {eventSettings.babyName}
              </h3>
              <p className="time-capsule-subtitle">
                Mensagens deixadas com carinho pelos amigos e familiares para a Maytê ler no futuro:
              </p>
            </div>

            <div className="time-capsule-grid">
              {guestbook.slice(0, 6).map((entry) => (
                <article key={entry.id} className="time-capsule-card">
                  <div className="time-capsule-quote-mark" aria-hidden="true">
                    “
                  </div>
                  <p className="time-capsule-message">{entry.message}</p>
                  <div className="time-capsule-footer">
                    <div className="time-capsule-avatar">
                      <Heart size={12} fill="var(--color-pink)" color="var(--color-pink-deep)" />
                    </div>
                    <div>
                      <strong className="time-capsule-author">{entry.author}</strong>
                      {entry.relation && (
                        <span className="time-capsule-relation">{entry.relation}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* SE LIBERADO: Formulário de Recado. SE AGENDADO: Aviso de Liberação */}
            {isCapsuleUnlocked ? (
              <form onSubmit={handleSendCapsuleMessage} className="time-capsule-quick-form">
                <div className="time-capsule-form-title">
                  <Sparkles size={15} color="var(--color-gold-deep)" />
                  <span>Deixe também um bilhete na Cápsula do Tempo da Maytê</span>
                </div>

                <div className="time-capsule-inputs">
                  <div className="royal-input-group">
                    <span className="royal-input-icon" aria-hidden="true">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Seu nome..."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="rsvp-field-input with-icon"
                      required
                    />
                  </div>

                  <div className="royal-input-group">
                    <span className="royal-input-icon" aria-hidden="true">
                      <MessageSquareHeart size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Escreva uma mensagem carinhosa para a Maytê..."
                      value={capsuleMessage}
                      onChange={(e) => setCapsuleMessage(e.target.value)}
                      className="rsvp-field-input with-icon"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-capsule-send btn-shimmer-gold">
                    <Send size={14} />
                    <span>Eternizar</span>
                  </button>
                </div>

                {capsuleSaved && (
                  <div className="time-capsule-saved-feedback">
                    ✨ Sua mensagem foi guardada na Cápsula do Tempo da Maytê! ❤️
                  </div>
                )}
              </form>
            ) : (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px dashed var(--color-gold)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--color-gold-deep)",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                >
                  <Clock size={15} /> Abertura Oficial no Dia do Chá de Fraldas (22 de Novembro)
                </span>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "var(--color-text-soft)" }}>
                  Deixe seu coração preparado: no grande dia, este espaço será liberado para que todos escrevam bilhetes eternos para a Maytê! ✨
                </p>
              </div>
            )}
          </div>
        )}

        <FloralDivider />
      </div>

      {/* Modal Lightbox Vintage de Polaroid Ampliada */}
      {lightboxPhoto && (
        <div
          className="modal-backdrop"
          onClick={() => setLightboxPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada da Polaroid"
        >
          <div
            className="polaroid-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              className="polaroid-lightbox-close"
              aria-label="Fechar foto"
            >
              <X size={20} />
            </button>

            <div className="polaroid-vintage-tape" aria-hidden="true" />

            <div className="polaroid-lightbox-img-stage">
              <img src={lightboxPhoto.url} alt={lightboxPhoto.caption} />
              <div className="polaroid-vintage-vignette" aria-hidden="true" />
            </div>

            <div className="polaroid-vintage-meta" style={{ marginTop: "0.85rem" }}>
              <span className="polaroid-vintage-cat-tag">
                {getCategoryLabel(lightboxPhoto.category)}
              </span>
              <span className="polaroid-vintage-date-stamp">
                {lightboxPhoto.dateStamp}
              </span>
            </div>

            <p className="polaroid-lightbox-caption">“{lightboxPhoto.caption}”</p>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Envio de Foto com Aviso de Moderação */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="memories-modal-title"
        >
          <div className="floral-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ color: "var(--color-text-soft)", padding: "4px" }}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-icon-badge">
              <CheckCircle2 size={28} color="var(--color-gold-deep)" />
            </div>

            <h3 id="memories-modal-title" className="modal-title">
              Foto Enviada com Sucesso! ✨
            </h3>

            <p className="modal-description">
              Sua Polaroid foi recebida com muito carinho. Para segurança e organização da princesinha, ela aparecerá no mural assim que for aprovada pelos papais da Maytê! 👑💖
            </p>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-floral-gold"
              style={{ width: "100%" }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
