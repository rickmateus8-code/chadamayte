import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface SectionMilestone {
  id: string;
  label: string;
  icon?: string;
}

const DEFAULT_MILESTONE: SectionMilestone = {
  id: "hero-top",
  label: "Capa do Convite",
  icon: "👑",
};

const MILESTONES: SectionMilestone[] = [
  DEFAULT_MILESTONE,
  { id: "welcome-section", label: "A Doce Espera", icon: "🌸" },
  { id: "countdown-section", label: "Contagem Regressiva", icon: "⏳" },
  { id: "details-section", label: "Local & Mapa", icon: "📍" },
  { id: "gifts-section", label: "Boutique de Mimos", icon: "🎁" },
  { id: "rsvp-section", label: "Confirmação de Presença", icon: "💌" },
  { id: "memories-section", label: "Álbum Polaroid", icon: "📸" },
  { id: "closing-section", label: "Com Amor, Papais", icon: "💖" },
];

export const ScrollProgressHeader: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [activeChapter, setActiveChapter] = useState<SectionMilestone>(DEFAULT_MILESTONE);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentProgress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
          setProgress(currentProgress);
          setIsScrolled(scrollY > 180);

          // Detect active milestone
          const probePoint = scrollY + window.innerHeight * 0.35;
          let currentMilestone = DEFAULT_MILESTONE;

          for (const m of MILESTONES) {
            const el = document.getElementById(m.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              const absoluteTop = rect.top + scrollY;
              if (absoluteTop <= probePoint) {
                currentMilestone = m;
              }
            }
          }

          setActiveChapter(currentMilestone);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 1. Barra de Ouro Líquido de Progresso de Leitura no Topo */}
      <div
        className="royal-scroll-progress-track"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso de leitura do convite real"
      >
        <div
          className="royal-scroll-progress-fill"
          style={{ width: `${progress}%` }}
        >
          <span className="royal-scroll-progress-spark" />
        </div>
      </div>

      {/* 2. Pílula Flutuante Discreta do Capítulo Atual & Voltar ao Topo */}
      <div className={`royal-reading-milestone-pill ${isScrolled ? "is-active" : ""}`}>
        <button
          type="button"
          onClick={scrollToTop}
          className="royal-milestone-btn"
          title="Toque para voltar ao topo"
          aria-label={`Capítulo atual: ${activeChapter.label}. Toque para voltar ao topo`}
        >
          <span className="royal-milestone-icon">{activeChapter.icon || "👑"}</span>
          <span className="royal-milestone-label">{activeChapter.label}</span>
          <span className="royal-milestone-percent">{Math.round(progress)}%</span>
          <ChevronUp size={13} className="royal-milestone-up" />
        </button>
      </div>
    </>
  );
};
