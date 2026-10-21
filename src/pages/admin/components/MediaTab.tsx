import React, { useState, useRef, useEffect } from "react";
import {
  ImagePlus,
  Trash2,
  Download,
  Camera,
  Sparkles,
  Film,
  LayoutGrid,
  Columns,
  GripVertical,
  Tag,
} from "lucide-react";
import { deleteAdminMedia, type AdminMedia } from "../../../lib/adminApi";
import {
  POLAROID_CATEGORIES,
  SEED_VINTAGE_POLAROIDS,
  formatPolaroidCaptionWithCategory,
  parsePolaroidCaption,
  type PolaroidCategoryKey,
  type VintagePolaroidItem,
} from "../../../config/portalConfig";
import { RoyalCornerFiligree } from "../../../components/brand/RoyalOrnaments";

interface MediaTabProps {
  token: string;
  mediaList: AdminMedia[];
  onRefresh: () => void;
}

type AdminAlbumGridMode = "vintage" | "grid-3" | "grid-2";

export const MediaTab: React.FC<MediaTabProps> = ({
  token,
  mediaList,
  onRefresh,
}) => {
  const [caption, setCaption] = useState("Recordação Real da Maytê ✨");
  const [uploadCategory, setUploadCategory] =
    useState<Exclude<PolaroidCategoryKey, "all">>("cha");
  const [activeCategory, setActiveCategory] = useState<PolaroidCategoryKey>("all");
  const [gridMode, setGridMode] = useState<AdminAlbumGridMode>("vintage");
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [items, setItems] = useState<VintagePolaroidItem[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const r2Items: VintagePolaroidItem[] = mediaList.map((m, idx) => {
      const parsed = parsePolaroidCaption(m.original_filename);
      const angles = [-2.1, 1.9, -1.6, 2.2];
      return {
        id: m.id,
        url: `/api/media/file/${m.id}`,
        caption: parsed.caption,
        category: parsed.category,
        dateStamp: new Date(m.created_at)
          .toLocaleDateString("pt-BR")
          .replace(/\//g, " • "),
        rotationDeg: angles[idx % angles.length] ?? 1.5,
        isSeed: false,
      };
    });
    setItems([...r2Items, ...SEED_VINTAGE_POLAROIDS]);
  }, [mediaList]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append(
        "caption",
        formatPolaroidCaptionWithCategory(
          caption.trim() || "Foto Oficial da Maytê ✨",
          uploadCategory
        )
      );
      await fetch("/api/media/upload", {
        method: "POST",
        body: fd,
      });
      onRefresh();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, isSeed?: boolean) => {
    if (isSeed) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    if (!confirm("Deseja remover esta foto da galeria pública da Maytê?")) return;
    const ok = await deleteAdminMedia(token, id);
    if (ok) onRefresh();
  };

  const reorderItems = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      if (!moved) return prev;
      copy.splice(to, 0, moved);
      return copy;
    });
  };

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((it) => it.category === activeCategory);

  const getCategoryLabel = (catKey: Exclude<PolaroidCategoryKey, "all">) => {
    return (
      POLAROID_CATEGORIES.find((c) => c.key === catKey)?.shortBadge ||
      "Chá de Fraldas 👑"
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Estúdio de Upload & Categorização dos Papais */}
      <div
        className="floral-welcome-card"
        style={{ position: "relative", padding: "1.75rem", textAlign: "left" }}
      >
        <RoyalCornerFiligree position="tl" size={44} />
        <RoyalCornerFiligree position="tr" size={44} />
        <RoyalCornerFiligree position="bl" size={44} />
        <RoyalCornerFiligree position="br" size={44} />

        <div style={{ marginBottom: "1rem" }}>
          <span className="section-eyebrow" style={{ marginBottom: "4px" }}>
            <Camera size={13} /> Acervo Cloudflare R2 • Polaroids Vintage
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.65rem",
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            Baú de Fotos & Polaroids Reais ({items.length})
          </h2>
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--color-text-soft)",
              margin: "4px 0 0 0",
            }}
          >
            Organize por <strong>Categoria</strong> e <strong>Modo de Grade</strong>, arraste para ordenar as Polaroids ou adicione novas fotos oficiais.
          </p>
        </div>

        {/* Seletor de Categoria para Nova Foto */}
        <div style={{ marginBottom: "1rem" }}>
          <span
            className="rsvp-field-label"
            style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}
          >
            <Tag size={13} color="var(--color-gold-deep)" />
            Categoria da Nova Polaroid:
          </span>
          <div className="polaroid-category-selector-pills" style={{ justifyContent: "flex-start" }}>
            {POLAROID_CATEGORIES.filter((c) => c.key !== "all").map((cat) => {
              const selected = uploadCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
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

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div className="royal-input-group" style={{ flex: 1, minWidth: "240px" }}>
            <span className="royal-input-icon">
              <Sparkles size={15} />
            </span>
            <input
              type="text"
              className="rsvp-field-input with-icon"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Dedicatória da Polaroid..."
            />
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="btn-floral-gold btn-shimmer-gold"
          >
            <ImagePlus size={16} />
            <span>
              {uploading ? "Revelando no R2..." : "Revelar Nova Polaroid"}
            </span>
          </button>
        </div>
      </div>

      {/* Barra de Filtro por Categoria + Alternador de Grade */}
      <div className="polaroid-album-toolbar" style={{ marginTop: 0 }}>
        <div className="polaroid-album-categories">
          {POLAROID_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            const count =
              cat.key === "all"
                ? items.length
                : items.filter((p) => p.category === cat.key).length;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`boutique-filter-pill ${active ? "is-active" : ""}`}
              >
                <span>{cat.label}</span>
                <span className="polaroid-cat-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="polaroid-grid-mode-switcher">
          <button
            type="button"
            onClick={() => setGridMode("vintage")}
            className={`polaroid-grid-btn ${gridMode === "vintage" ? "is-active" : ""}`}
          >
            <Film size={14} />
            <span>Varal Antigo</span>
          </button>
          <button
            type="button"
            onClick={() => setGridMode("grid-3")}
            className={`polaroid-grid-btn ${gridMode === "grid-3" ? "is-active" : ""}`}
          >
            <LayoutGrid size={14} />
            <span>Grade</span>
          </button>
          <button
            type="button"
            onClick={() => setGridMode("grid-2")}
            className={`polaroid-grid-btn ${gridMode === "grid-2" ? "is-active" : ""}`}
          >
            <Columns size={14} />
            <span>Ampla</span>
          </button>
        </div>
      </div>

      {/* Galeria Arrastável de Polaroids Vintage */}
      <div className={`polaroid-preview-gallery mode-${gridMode}`}>
        {filtered.map((m, idx) => (
          <figure
            key={m.id}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIdx !== null) {
                reorderItems(dragIdx, idx);
                setDragIdx(null);
              }
            }}
            className="royal-polaroid-frame is-vintage-animated"
            style={
              {
                "--polaroid-tilt":
                  gridMode === "vintage" ? `${m.rotationDeg}deg` : "0deg",
                "--polaroid-delay": `${(idx % 5) * 0.4}s`,
                margin: 0,
              } as React.CSSProperties
            }
          >
            <div className="polaroid-vintage-tape" aria-hidden="true" />

            <div className="royal-polaroid-img-wrap">
              <img src={m.url} alt={m.caption} loading="lazy" />
              <div className="polaroid-vintage-vignette" aria-hidden="true" />
            </div>

            <div className="polaroid-vintage-meta">
              <span className="polaroid-vintage-cat-tag">
                {getCategoryLabel(m.category)}
              </span>
              <span className="polaroid-vintage-date-stamp">{m.dateStamp}</span>
            </div>

            <figcaption className="royal-polaroid-caption">
              “{m.caption}”
            </figcaption>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "0.55rem",
                paddingTop: "0.45rem",
                borderTop: "1px dashed rgba(212, 169, 89, 0.35)",
              }}
            >
              <span
                className="drag-handle"
                style={{ width: "28px", height: "28px" }}
                title="Arraste para reordenar Polaroid"
              >
                <GripVertical size={14} />
              </span>

              <div style={{ display: "flex", gap: "0.4rem" }}>
                <a
                  href={m.url}
                  download={`polaroid-mayte-${m.id}.png`}
                  className="btn-mini-luxury"
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.28rem 0.6rem",
                    textDecoration: "none",
                  }}
                >
                  <Download size={12} /> Baixar
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id, m.isSeed)}
                  className="btn-remove-companion"
                  style={{ width: "28px", height: "28px" }}
                  title="Remover Polaroid"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
};
