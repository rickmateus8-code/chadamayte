import React from "react";
import { Sparkles, Heart } from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../brand/RoyalOrnaments";
import { invitationContent } from "../../config/invitationContent";
import { useEventContext } from "../../context/EventContext";

export const WelcomeSection: React.FC = () => {
  const { welcome } = invitationContent.sections;
  const { invitationData, portalConfig } = useEventContext();

  return (
    <section id="welcome-section" className="invitation-section reveal-on-scroll" aria-label="Apresentação">
      <div className="invitation-container-narrow">
        <div className="floral-welcome-card">
          <RoyalCornerFiligree position="tl" size={54} />
          <RoyalCornerFiligree position="tr" size={54} />
          <RoyalCornerFiligree position="bl" size={54} />
          <RoyalCornerFiligree position="br" size={54} />

          <RoyalCrestOrnament width={180} />

          <span className="welcome-tagline">
            <Sparkles size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
            {portalConfig.welcomeTitle || welcome.title}
            <Sparkles size={12} style={{ display: "inline", marginLeft: "6px", verticalAlign: "middle" }} />
          </span>

          <h2 className="welcome-greeting">
            {invitationData?.invitation?.displayName
              ? `Olá, ${invitationData.invitation.displayName}!`
              : welcome.greeting}
          </h2>

          <div className="welcome-badge">
            {portalConfig.welcomeBadge || welcome.badge}
          </div>

          <div className="welcome-paragraphs">
            <p className="welcome-text">
              {portalConfig.welcomeSubtitle || welcome.paragraphs[0]}
            </p>
            <p className="welcome-text" style={{ fontWeight: 600, color: "var(--color-pink-deep)" }}>
              “{portalConfig.welcomeHighlightQuote || welcome.paragraphs[1]}”
            </p>
          </div>

          <div className="welcome-signature-seal">
            <Heart size={14} fill="var(--color-pink)" color="var(--color-pink-deep)" />
            <span>Com todo o nosso amor, Papais da Maytê</span>
            <Heart size={14} fill="var(--color-pink)" color="var(--color-pink-deep)" />
          </div>
        </div>

        <FloralDivider />
      </div>
    </section>
  );
};
