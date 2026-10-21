import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Compass,
  Car,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { RoyalCornerFiligree } from "../brand/RoyalOrnaments";

interface InteractiveRoyalMapProps {
  locationName: string;
  locationAddress: string;
  locationCity: string;
  mapUrl?: string;
}

export const InteractiveRoyalMap: React.FC<InteractiveRoyalMapProps> = ({
  locationName,
  locationAddress,
  locationCity,
  mapUrl,
}) => {
  const [mapViewMode, setMapViewMode] = useState<"standard" | "satellite">("standard");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fullAddress = `${locationName}, ${locationAddress}, ${locationCity}`;
  const encodedQuery = encodeURIComponent(fullAddress);

  // Map Embed URLs (Standard view & Satellite view with coordinates/query)
  const embedUrl =
    mapViewMode === "satellite"
      ? `https://maps.google.com/maps?q=${encodedQuery}&t=k&z=17&ie=UTF8&iwloc=&output=embed`
      : `https://maps.google.com/maps?q=${encodedQuery}&t=m&z=16&ie=UTF8&iwloc=&output=embed`;

  // Direct app navigation links
  const googleMapsRouteUrl =
    mapUrl && mapUrl.trim() !== ""
      ? mapUrl
      : `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;

  const wazeUrl = `https://waze.com/ul?q=${encodedQuery}&navigate=yes`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${encodedQuery}`;
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodedQuery}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${locationName} — ${locationAddress}, ${locationCity}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch {
      // Fallback if clipboard API is restricted
    }
  };

  return (
    <div
      className={`royal-interactive-map-container ${isExpanded ? "is-map-expanded" : ""}`}
      aria-label="Mapa Interativo e Rotas de Acesso"
    >
      {/* Moldura Superior do Mapa com Abas de Visualização e Botão Expandir */}
      <div className="royal-map-header-bar">
        <div className="royal-map-title-wrap">
          <div className="royal-map-pin-pulse">
            <MapPin size={17} color="#fff" />
          </div>
          <div>
            <span className="royal-map-badge">Localização Real</span>
            <h4 className="royal-map-venue-name">{locationName}</h4>
          </div>
        </div>

        <div className="royal-map-controls-group">
          <div className="royal-map-view-switcher" role="tablist" aria-label="Modo de visualização do mapa">
            <button
              type="button"
              role="tab"
              aria-selected={mapViewMode === "standard"}
              onClick={() => setMapViewMode("standard")}
              className={`royal-map-view-pill ${mapViewMode === "standard" ? "is-active" : ""}`}
            >
              <Compass size={13} />
              <span>Mapa</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mapViewMode === "satellite"}
              onClick={() => setMapViewMode("satellite")}
              className={`royal-map-view-pill ${mapViewMode === "satellite" ? "is-active" : ""}`}
            >
              <Sparkles size={13} />
              <span>Satélite</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="royal-map-expand-btn"
            title={isExpanded ? "Recolher mapa" : "Ampliar mapa na tela"}
            aria-label={isExpanded ? "Recolher mapa" : "Ampliar mapa na tela"}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Frame Interativo do Mapa com Cantoneiras Douradas */}
      <div className="royal-map-frame-wrapper">
        <RoyalCornerFiligree position="tl" size={38} />
        <RoyalCornerFiligree position="tr" size={38} />
        <RoyalCornerFiligree position="bl" size={38} />
        <RoyalCornerFiligree position="br" size={38} />

        <iframe
          title={`Mapa do local: ${locationName}`}
          src={embedUrl}
          className="royal-map-iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        {/* Floating Pin Card Over Map */}
        <div className="royal-map-floating-overlay" aria-hidden="true">
          <span className="royal-map-floating-pill">
            <span className="royal-map-dot-beacon" />
            <span>Toque e arraste para explorar o mapa</span>
          </span>
        </div>
      </div>

      {/* Seletor Dinâmico de Aplicativos de Navegação (1 Toque) */}
      <div className="royal-map-apps-row">
        <span className="royal-map-apps-label">
          <Navigation size={13} />
          Traçar Rota Direta:
        </span>

        <div className="royal-map-apps-pills">
          <a
            href={googleMapsRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="royal-app-pill app-google"
            title="Abrir rota no Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink size={12} />
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="royal-app-pill app-waze"
            title="Navegar com Waze"
          >
            <span>Waze</span>
            <ExternalLink size={12} />
          </a>

          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="royal-app-pill app-apple"
            title="Abrir no Apple Maps"
          >
            <span>Apple Maps</span>
            <ExternalLink size={12} />
          </a>

          <a
            href={uberUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="royal-app-pill app-uber"
            title="Chamar Uber até o local"
          >
            <span>Uber</span>
            <Car size={12} />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="royal-app-pill app-copy"
            title="Copiar endereço completo"
          >
            {copied ? <Check size={12} color="#1b7a42" /> : <Copy size={12} />}
            <span>{copied ? "Copiado!" : "Copiar"}</span>
          </button>
        </div>
      </div>

      {/* Dicas Nobres de Chegada & Estacionamento */}
      <div className="royal-map-tips-grid">
        <div className="royal-map-tip-card">
          <div className="royal-map-tip-icon">
            <Car size={16} />
          </div>
          <div>
            <strong className="royal-map-tip-title">Estacionamento & Recepção</strong>
            <p className="royal-map-tip-desc">
              Espaço com estacionamento no local e acesso acessível para carrinhos de bebê.
            </p>
          </div>
        </div>

        <div className="royal-map-tip-card">
          <div className="royal-map-tip-icon">
            <Clock size={16} />
          </div>
          <div>
            <strong className="royal-map-tip-title">Dica de Chegada Real</strong>
            <p className="royal-map-tip-desc">
              Sugerimos chegar com 10 minutos de antecedência para registrar sua mensagem na Cápsula do Tempo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
