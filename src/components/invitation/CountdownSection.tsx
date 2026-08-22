import React, { useState, useEffect } from "react";
import { FloralDivider } from "../brand/FloralDivider";
import { invitationContent } from "../../config/invitationContent";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0 || isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isFinished: false };
}

export const CountdownSection: React.FC = () => {
  const { countdown } = invitationContent.sections;
  const targetDate = invitationContent.event.targetDate;

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  return (
    <section className="invitation-section" aria-label="Contagem Regressiva">
      <div className="invitation-container-narrow">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <span className="section-eyebrow">
            Falta Pouco
          </span>
          <h2 className="section-title">
            {countdown.title}
          </h2>
        </div>

        {timeLeft.isFinished ? (
          <div className="floral-welcome-card">
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", color: "var(--color-pink-deep)" }}>
              {countdown.finishedText}
            </p>
          </div>
        ) : (
          <div className="floral-countdown-grid" role="timer" aria-live="polite">
            <div className="floral-countdown-box">
              <span className="countdown-number">{padZero(timeLeft.days)}</span>
              <span className="countdown-label">{countdown.labels.days}</span>
            </div>
            <div className="floral-countdown-box">
              <span className="countdown-number">{padZero(timeLeft.hours)}</span>
              <span className="countdown-label">{countdown.labels.hours}</span>
            </div>
            <div className="floral-countdown-box">
              <span className="countdown-number">{padZero(timeLeft.minutes)}</span>
              <span className="countdown-label">{countdown.labels.minutes}</span>
            </div>
            <div className="floral-countdown-box">
              <span className="countdown-number">{padZero(timeLeft.seconds)}</span>
              <span className="countdown-label">{countdown.labels.seconds}</span>
            </div>
          </div>
        )}

        <FloralDivider />
      </div>
    </section>
  );
};