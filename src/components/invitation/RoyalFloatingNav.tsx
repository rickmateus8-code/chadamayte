import React, { useState, useEffect } from "react";
import { Crown, Calendar, Gift, CheckCircle2, Camera } from "lucide-react";

const NAV_ITEMS = [
  { id: "hero-top", label: "Início", icon: Crown },
  { id: "details-section", label: "Local", icon: Calendar },
  { id: "gifts-section", label: "Mimos", icon: Gift },
  { id: "rsvp-section", label: "Presença", icon: CheckCircle2 },
  { id: "memories-section", label: "Álbum", icon: Camera },
];

export const RoyalFloatingNav: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("hero-top");
  const [dockVisible, setDockVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setDockVisible(window.scrollY > 240);
      const scrollY = window.scrollY + window.innerHeight * 0.38;
      let current = "hero-top";

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollY) {
          current = item.id;
        }
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveId(id);
    if (id === "hero-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`royal-floating-dock ${dockVisible ? "is-dock-visible" : "is-dock-hidden"}`}
      aria-label="Navegação rápida do convite"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(item.id)}
            className={`royal-dock-btn ${isActive ? "is-active" : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            <Icon size={15} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
