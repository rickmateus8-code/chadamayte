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
    <div className="invitation-page">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Introdução / Mensagem Emocional */}
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
    </div>
  );
};