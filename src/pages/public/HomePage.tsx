import React from "react";
import { HeroSection } from "../../components/invitation/HeroSection";
import { WelcomeSection } from "../../components/invitation/WelcomeSection";
import { EventDetailsSection } from "../../components/invitation/EventDetailsSection";
import { CountdownSection } from "../../components/invitation/CountdownSection";
import { RsvpSection } from "../../components/invitation/RsvpSection";
import { MemoriesSection } from "../../components/invitation/MemoriesSection";
import { GiftsSection } from "../../components/invitation/GiftsSection";
import { ClosingSection } from "../../components/invitation/ClosingSection";

export const HomePage: React.FC = () => {
  return (
    <div className="invitation-canvas">
      <main className="stationery-envelope-card" aria-label="Convite do Chá de Fraldas da Maytê">
        {/* Moldura Interna de Estamparia Dourada */}
        <div className="stationery-inner-frame" aria-hidden="true" />

        {/* Cantos em Ouro */}
        <div className="stationery-corner stationery-corner-tl" aria-hidden="true" />
        <div className="stationery-corner stationery-corner-tr" aria-hidden="true" />
        <div className="stationery-corner stationery-corner-bl" aria-hidden="true" />
        <div className="stationery-corner stationery-corner-br" aria-hidden="true" />

        {/* 1. Capa / Hero com Brasão Floral da Princesa Maytê */}
        <HeroSection />

        {/* 2. Mensagem de Boas-Vindas / Apresentação Acolhedora */}
        <WelcomeSection />

        {/* 3. Informações do Evento & Observações */}
        <EventDetailsSection />

        {/* 4. Contagem Regressiva */}
        <CountdownSection />

        {/* 5. Confirmar Presença (Destaque Principal) */}
        <RsvpSection />

        {/* 6. Mural de Fotos & Memórias (Envie suas fotos) */}
        <MemoriesSection />

        {/* 7. Sugestões de Presentes & Fraldas */}
        <GiftsSection />

        {/* 8. Encerramento com Barrado Rendado */}
        <ClosingSection />
      </main>
    </div>
  );
};