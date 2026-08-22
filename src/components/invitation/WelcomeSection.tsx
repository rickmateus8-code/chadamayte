import React from "react";
import { FloralDivider } from "../brand/FloralDivider";
import { invitationContent } from "../../config/invitationContent";

export const WelcomeSection: React.FC = () => {
  const { welcome } = invitationContent.sections;

  return (
    <section id="welcome-section" className="invitation-section" aria-label="Apresentação">
      <div className="invitation-container-narrow">
        <div className="floral-welcome-card">
          <span className="welcome-tagline">
            {welcome.title}
          </span>

          <h2 className="welcome-greeting">
            {welcome.greeting}
          </h2>

          <div className="welcome-badge">
            {welcome.badge}
          </div>

          <div className="welcome-paragraphs">
            {welcome.paragraphs.map((p, idx) => (
              <p key={idx} className="welcome-text">
                {p}
              </p>
            ))}
          </div>
        </div>

        <FloralDivider />
      </div>
    </section>
  );
};