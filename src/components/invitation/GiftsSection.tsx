import React, { useState } from "react";
import {
  Gift,
  Heart,
  Sparkles,
  Check,
  Copy,
  QrCode,
  X,
  ArrowDownCircle,
} from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { RoyalCrestOrnament } from "../brand/RoyalOrnaments";
import { invitationContent, type GiftBoutiqueItem } from "../../config/invitationContent";
import { useEventContext } from "../../context/EventContext";

export const GiftsSection: React.FC = () => {
  const { gifts } = invitationContent.sections;
  const { eventSettings, portalConfig, selectedMimos, toggleMimo } = useEventContext();

  const [activeCategory, setActiveCategory] = useState<"all" | "diapers" | "clothes" | "care">("all");
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  const dynamicBoutiqueItems: GiftBoutiqueItem[] =
    portalConfig.giftItems && portalConfig.giftItems.filter((g) => g.enabled).length > 0
      ? portalConfig.giftItems
          .filter((g) => g.enabled)
          .map((g) => ({
            id: g.id,
            title: g.title,
            subtitle: g.description,
            tag: g.category,
            category: g.title.toLowerCase().includes("fralda")
              ? "diapers"
              : g.title.toLowerCase().includes("look") || g.title.toLowerCase().includes("roup")
              ? "clothes"
              : "care",
            iconName: g.highlight ? "Sparkles" : g.title.toLowerCase().includes("pix") ? "Heart" : "Gift",
          }))
      : gifts.boutiqueItems;

  const filteredItems = dynamicBoutiqueItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const renderIcon = (iconName: GiftBoutiqueItem["iconName"], isSelected: boolean) => {
    const color = isSelected ? "var(--color-gold-deep)" : "var(--color-pink-deep)";
    switch (iconName) {
      case "Sparkles":
        return <Sparkles size={22} color={color} />;
      case "Heart":
        return <Heart size={22} color={color} />;
      case "Gift":
      default:
        return <Gift size={22} color={color} />;
    }
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(eventSettings.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3500);
    } catch {
      // Fallback
    }
  };

  const scrollToRsvp = () => {
    const el = document.getElementById("rsvp-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="gifts-section" className="invitation-section reveal-on-scroll" aria-label="Sugestões de Presentes">
      <div className="invitation-container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
          <RoyalCrestOrnament width={190} />
          <span className="section-eyebrow">
            Mimos para a Princesa
          </span>
          <h2 className="section-title">
            {gifts.title}
          </h2>
          <p className="section-subtitle">
            {gifts.subtitle}
          </p>
        </div>

        {/* Filtros da Boutique Real */}
        <div className="boutique-filter-bar" role="tablist" aria-label="Categorias de mimos">
          {[
            { id: "all", label: "Todos os Mimos" },
            { id: "diapers", label: "Fraldas & Higiene" },
            { id: "clothes", label: "Lookinhos" },
            { id: "care", label: "Conforto & Banho" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`boutique-filter-pill ${activeCategory === cat.id ? "is-active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grade Interativa da Boutique de Mimos */}
        <div className="boutique-grid">
          {filteredItems.map((item) => {
            const isSelected = selectedMimos.includes(item.title);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleMimo(item.title)}
                className={`boutique-item-card ${isSelected ? "is-selected" : ""}`}
                aria-pressed={isSelected}
              >
                <div className="boutique-item-top">
                  <span className="boutique-item-tag">{item.tag}</span>
                  <span className={`boutique-check-circle ${isSelected ? "is-checked" : ""}`}>
                    {isSelected ? <Check size={14} /> : "+"}
                  </span>
                </div>

                <div className="boutique-icon-medal">
                  {renderIcon(item.iconName, isSelected)}
                </div>

                <h3 className="boutique-item-title">{item.title}</h3>
                <p className="boutique-item-subtitle">{item.subtitle}</p>

                <div className="boutique-item-action-label">
                  {isSelected ? "✓ Mimo Selecionado com Carinho" : "Toque para escolher este mimo"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Barra Resumo de Mimos Escolhidos */}
        {selectedMimos.length > 0 && (
          <div className="boutique-selected-banner">
            <div className="boutique-selected-info">
              <Sparkles size={18} color="var(--color-gold-deep)" />
              <span>
                Você escolheu <strong>{selectedMimos.length}</strong>{" "}
                {selectedMimos.length === 1 ? "mimo especial" : "mimos especiais"} para a Maytê!
              </span>
            </div>
            <button
              type="button"
              onClick={scrollToRsvp}
              className="btn-mini-gold-solid"
            >
              <ArrowDownCircle size={15} />
              Vincular na Presença
            </button>
          </div>
        )}

        {/* Card Luxuoso de Mimo via PIX */}
        <div className="royal-pix-showcase-card">
          <div className="royal-pix-badge">
            <QrCode size={22} color="var(--color-gold-deep)" />
          </div>
          <div className="royal-pix-content">
            <h3 className="royal-pix-title">{gifts.pixNotice}</h3>
            <p className="royal-pix-desc">
              Prefere deixar os papais escolherem o mimo ideal para o enxoval da Maytê? Você pode enviar um carinho via PIX com toda praticidade!
            </p>
            <p className="royal-pix-brands">{gifts.message}</p>
          </div>
          <div className="royal-pix-cta">
            <button
              type="button"
              onClick={() => setPixModalOpen(true)}
              className="btn-floral-gold"
            >
              <Sparkles size={16} />
              MIMO REAL VIA PIX
            </button>
          </div>
        </div>

        <FloralDivider />
      </div>

      {/* Modal Real de PIX */}
      {pixModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setPixModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pix-modal-title"
        >
          <div className="floral-modal-card royal-pix-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setPixModalOpen(false)}
                style={{ color: "var(--color-text-soft)", padding: "4px", background: "none", border: "none", cursor: "pointer" }}
                aria-label="Fechar modal PIX"
              >
                <X size={20} />
              </button>
            </div>

            <div className="royal-pix-modal-crown">
              <img src="/images/mayte-royal-crown.png" alt="Coroa da Maytê" />
            </div>

            <span className="section-eyebrow" style={{ marginBottom: "4px" }}>
              Mimo para o Enxoval
            </span>
            <h3 id="pix-modal-title" className="modal-title">
              Carinho via PIX para a {eventSettings.babyName}
            </h3>
            <p className="modal-description" style={{ marginBottom: "1rem" }}>
              Qualquer valor enviado com amor ajuda a compor o ninho da nossa pequena princesa! ❤️
            </p>

            {/* Moldura Ilustrativa Dourada + Chave PIX */}
            <div className="royal-pix-key-box">
              <span className="royal-pix-key-label">Chave PIX Oficial ({eventSettings.pixBeneficiary})</span>
              <code className="royal-pix-key-value">{eventSettings.pixKey}</code>

              <button
                type="button"
                onClick={handleCopyPix}
                className="btn-copy-pix-gold"
              >
                {copiedPix ? <Check size={16} /> : <Copy size={16} />}
                {copiedPix ? "CHAVE PIX COPIADA COM CARINHO! ✓" : "COPIAR CHAVE PIX"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPixModalOpen(false)}
              className="btn-rsvp-decline"
              style={{ width: "100%", marginTop: "0.75rem" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
