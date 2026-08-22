import React from "react";
import { HeroSection } from "../../components/invitation/HeroSection";
import { IntroSection } from "../../components/invitation/IntroSection";
import { CountdownSection } from "../../components/invitation/CountdownSection";
import { EventInfoSection } from "../../components/invitation/EventInfoSection";
import { LocationSection } from "../../components/invitation/LocationSection";
import { SpecialMessageSection } from "../../components/invitation/SpecialMessageSection";
import { GallerySection } from "../../components/invitation/GallerySection";
import { GiftsSection } from "../../components/invitation/GiftsSection";
import { RsvpPreviewSection } from "../../components/invitation/RsvpPreviewSection";
import { ClosingSection } from "../../components/invitation/ClosingSection";

export const HomePage: React.FC = () => {
  return (
    <div className="invitation-canvas">
      <main className="stationery-envelope-card" aria-label="Convite Virtual da Maytê">
        {/* Moldura Interna de Estamparia Dourada */}
        <div className="stationery-inner-frame" aria-hidden="true" />

        {/* Cantos Ornamentais em Ouro Nobre */}
        <div className="stationery-corner stationery-corner-tl" aria-hidden="true" />
        <div className="stationery-corner stationery-corner-tr" aria-hidden="true" />
        <div className="stationery-corner stationery-corner-bl" aria-hidden="true" />
        <div className="stationery-corner stationery-corner-br" aria-hidden="true" />

        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Introdução / Mensagem de Abertura */}
        <IntroSection />

        {/* 3. Contagem Regressiva */}
        <CountdownSection />

        {/* 4. Informações do Evento */}
        <EventInfoSection />

        {/* 5. Localização */}
        <LocationSection />

        {/* 6. Mensagem Especial aos Convidados */}
        <SpecialMessageSection />

        {/* 7. Galeria */}
        <GallerySection />

        {/* 8. Sugestões de Presentes */}
        <GiftsSection />

        {/* 9. Confirmação de Presença Visual */}
        <RsvpPreviewSection />

        {/* 10. Encerramento */}
        <ClosingSection />
      </main>
    </div>
  );
};