import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { EventProvider, useEventContext } from "../../context/EventContext";
import { RoyalEnvelopeIntro } from "../../components/invitation/RoyalEnvelopeIntro";
import { RoyalMusicBox } from "../../components/invitation/RoyalMusicBox";
import { RoyalFloatingNav } from "../../components/invitation/RoyalFloatingNav";
import { ScrollProgressHeader } from "../../components/invitation/ScrollProgressHeader";
import { RoyalCornerFiligree } from "../../components/brand/RoyalOrnaments";
import { HeroSection } from "../../components/invitation/HeroSection";
import { MayteBornBanner } from "../../components/invitation/MayteBornBanner";
import { WelcomeSection } from "../../components/invitation/WelcomeSection";
import { EventDetailsSection } from "../../components/invitation/EventDetailsSection";
import { CountdownSection } from "../../components/invitation/CountdownSection";
import { RsvpSection } from "../../components/invitation/RsvpSection";
import { MemoriesSection } from "../../components/invitation/MemoriesSection";
import { GiftsSection } from "../../components/invitation/GiftsSection";
import { ClosingSection } from "../../components/invitation/ClosingSection";

const InvitationInnerStage: React.FC = () => {
  const { isEnvelopeOpen, portalConfig } = useEventContext();

  // IntersectionObserver fallback for browsers without native CSS animation-timeline: view()
  useEffect(() => {
    if (!isEnvelopeOpen) return;

    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("(animation-timeline: view()) and (animation-range: entry)");

    if (supportsScrollTimeline) return;

    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isEnvelopeOpen]);

  return (
    <div className="invitation-canvas">
      {/* Caixinha de Música Real Flutuante */}
      <RoyalMusicBox />

      {/* Barra Flutuante de Cristal & Ouro (quando o convite está aberto) */}
      {isEnvelopeOpen && (
        <>
          <ScrollProgressHeader />
          <RoyalFloatingNav />
        </>
      )}

      {/* Cerimônia de Abertura: Envelope Real 3D com Lacre de Cera Dourado */}
      {!isEnvelopeOpen ? (
        <RoyalEnvelopeIntro />
      ) : (
        <main className="stationery-envelope-card" aria-label="Convite do Chá de Fraldas da Maytê">
          {/* Moldura Interna de Estamparia Dourada */}
          <div className="stationery-inner-frame" aria-hidden="true" />

          {/* Arabescos Reais em Folha de Ouro nos 4 Cantos da Folha */}
          <RoyalCornerFiligree position="tl" size={76} />
          <RoyalCornerFiligree position="tr" size={76} />
          <RoyalCornerFiligree position="bl" size={76} />
          <RoyalCornerFiligree position="br" size={76} />

          {/* 1. Capa / Hero com Brasão Floral da Princesa Maytê */}
          <HeroSection />

          {/* 1b. Banner Evolutivo ("Doce Espera" ou "A Maytê Nasceu!") */}
          <MayteBornBanner />

          {/* Seções Dinâmicas Ordenáveis e Ativáveis no Painel Real (/admin) */}
          {portalConfig.portalSections
            .filter((sec) => sec.enabled)
            .map((sec) => {
              switch (sec.key) {
                case "welcome":
                  return <WelcomeSection key={sec.id} />;
                case "details":
                  return (
                    <React.Fragment key={sec.id}>
                      <CountdownSection />
                      <EventDetailsSection />
                    </React.Fragment>
                  );
                case "gifts":
                  return <GiftsSection key={sec.id} />;
                case "rsvp":
                  return <RsvpSection key={sec.id} />;
                case "memories":
                  return <MemoriesSection key={sec.id} />;
                default:
                  return null;
              }
            })}

          {/* 8. Encerramento com Barrado Rendado */}
          <ClosingSection />
        </main>
      )}
    </div>
  );
};

export const HomePage: React.FC = () => {
  const { token } = useParams<{ token?: string }>();

  return (
    <EventProvider token={token}>
      <InvitationInnerStage />
    </EventProvider>
  );
};
