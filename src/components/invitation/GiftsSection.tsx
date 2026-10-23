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
  Baby,
  Shirt,
  PackageCheck,
  Crown,
  Smile,
  Milk,
  ShoppingBag,
  Star,
  Music,
  HeartHandshake,
} from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { RoyalCrestOrnament } from "../brand/RoyalOrnaments";
import { invitationContent } from "../../config/invitationContent";
import { useEventContext } from "../../context/EventContext";

export function renderRoyalGiftIcon(iconName: string | undefined, color: string, size = 22) {
  switch (iconName) {
    case "Baby":
      return <Baby size={size} color={color} />;
    case "Shirt":
      return <Shirt size={size} color={color} />;
    case "PackageCheck":
      return <PackageCheck size={size} color={color} />;
    case "Crown":
      return <Crown size={size} color={color} />;
    case "Smile":
      return <Smile size={size} color={color} />;
    case "Milk":
      return <Milk size={size} color={color} />;
    case "ShoppingBag":
      return <ShoppingBag size={size} color={color} />;
    case "Star":
      return <Star size={size} color={color} />;
    case "Music":
      return <Music size={size} color={color} />;
    case "HeartHandshake":
      return <HeartHandshake size={size} color={color} />;
    case "Heart":
      return <Heart size={size} color={color} />;
    case "Sparkles":
      return <Sparkles size={size} color={color} />;
    case "Gift":
    default:
      return <Gift size={size} color={color} />;
  }
}

export const GiftsSection: React.FC = () => {
  const { gifts } = invitationContent.sections;
  const { eventSettings, portalConfig, selectedMimos, toggleMimo } = useEventContext();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // PIX só é exibido se estiver ativado nas configurações e houver chave configurada
  const isPixActive = Boolean(
    portalConfig.pixEnabled &&
    eventSettings.pixKey &&
    eventSettings.pixKey.trim().length > 0 &&
    eventSettings.pixKey.trim().toLowerCase() !== "none" &&
    eventSettings.pixKey.trim().toLowerCase() !== "desativado"
  );

  // Map configured gift categories
  const categoriesList = portalConfig.giftCategories && portalConfig.giftCategories.length > 0
    ? portalConfig.giftCategories
    : [
        { id: "fraldas", name: "Fraldas & Cuidados", icon: "PackageCheck" },
        { id: "enxoval", name: "Enxoval & Lookinhos", icon: "Shirt" },
        { id: "banho", name: "Hora do Banho", icon: "Sparkles" },
        { id: "conforto", name: "Passeio & Conforto", icon: "Baby" },
        { id: "livre", name: "Escolha Livre", icon: "Gift" },
      ];

  // Dynamic gift items filtered by enabled status
  const rawItems = portalConfig.giftItems && portalConfig.giftItems.filter((g) => g.enabled).length > 0
    ? portalConfig.giftItems.filter((g) => g.enabled)
    : [
        {
          id: "seed-fralda-p",
          title: "Fraldas RN ou P + Mimo",
          category: "fraldas",
          description: "Para os primeiros dias da nossa princesinha.",
          icon: "PackageCheck",
          highlight: false,
          enabled: true,
        },
        {
          id: "seed-fralda-m",
          title: "Fraldas Tamanho M + Lenços",
          category: "fraldas",
          description: "A fase em que a Maytê mais vai usar!",
          icon: "PackageCheck",
          highlight: true,
          enabled: true,
        },
        {
          id: "seed-lookinho",
          title: "Lookinho Princesa (3 a 9 meses)",
          category: "enxoval",
          description: "Vestidinhos, bodies de algodão delicados.",
          icon: "Shirt",
          highlight: false,
          enabled: true,
        },
      ];

  // If PIX is disabled, filter out items that are specifically PIX contributions
  const items = portalConfig.pixEnabled
    ? rawItems
    : rawItems.filter(
        (it) =>
          !it.title.toLowerCase().includes("pix") &&
          !it.description.toLowerCase().includes("pix")
      );

  const filteredItems = items.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

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
            {isPixActive
              ? gifts.subtitle
              : "Sua presença já é o nosso maior presente! Se desejar mimar a nossa princesinha, escolha um item da nossa boutique abaixo para vincular à sua confirmação:"}
          </p>
        </div>

        {/* Filtros da Boutique Real por Categorias Configuráveis */}
        <div className="boutique-filter-bar" role="tablist" aria-label="Categorias de mimos">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={`boutique-filter-pill ${activeCategory === "all" ? "is-active" : ""}`}
          >
            Todos os Mimos
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`boutique-filter-pill ${activeCategory === cat.id ? "is-active" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              {renderRoyalGiftIcon(cat.icon, activeCategory === cat.id ? "var(--color-gold-deep)" : "var(--color-pink-deep)", 14)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Grade Interativa da Boutique de Mimos */}
        <div className="boutique-grid">
          {filteredItems.map((item) => {
            const isSelected = selectedMimos.includes(item.title);
            const catDef = categoriesList.find((c) => c.id === item.category);
            const iconName = item.icon || catDef?.icon || "Gift";
            const color = isSelected ? "var(--color-gold-deep)" : "var(--color-pink-deep)";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleMimo(item.title)}
                className={`boutique-item-card ${isSelected ? "is-selected" : ""}`}
                aria-pressed={isSelected}
              >
                <div className="boutique-item-top">
                  <span className="boutique-item-tag">{catDef?.name || item.category}</span>
                  <span className={`boutique-check-circle ${isSelected ? "is-checked" : ""}`}>
                    {isSelected ? <Check size={14} /> : "+"}
                  </span>
                </div>

                <div className="boutique-icon-medal">
                  {renderRoyalGiftIcon(iconName, color, 22)}
                </div>

                <h3 className="boutique-item-title">{item.title}</h3>
                <p className="boutique-item-subtitle">{item.description}</p>

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

        {/* Card Luxuoso de Mimo via PIX (Ativável/Desativável pelo Admin) */}
        {isPixActive && (
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
        )}

        {/* Sugestão de Marcas de Fraldas (Apenas quando PIX estiver desativado) */}
        {!isPixActive && gifts.message && (
          <div
            style={{
              margin: "1.5rem auto 0 auto",
              maxWidth: "580px",
              padding: "0.85rem 1.25rem",
              background: "linear-gradient(135deg, rgba(255, 245, 248, 0.85) 0%, rgba(253, 248, 240, 0.85) 100%)",
              border: "1px dashed rgba(212, 169, 89, 0.4)",
              borderRadius: "var(--radius-md)",
              textAlign: "center",
              fontSize: "0.85rem",
              color: "var(--color-text-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={15} color="var(--color-gold-deep)" style={{ flexShrink: 0 }} />
            <span>{gifts.message}</span>
          </div>
        )}

        <FloralDivider />
      </div>

      {/* Modal Real de PIX */}
      {isPixActive && pixModalOpen && (
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
