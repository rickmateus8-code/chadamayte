import React, { useState, useEffect } from "react";
import { Sparkles, Crown } from "lucide-react";
import { FloralDivider } from "../brand/FloralDivider";
import { RoyalCrestOrnament } from "../brand/RoyalOrnaments";
import { invitationContent } from "../../config/invitationContent";
import { useEventContext } from "../../context/EventContext";

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
  const { eventSettings } = useEventContext();
  const targetDate = eventSettings.targetDate;

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    setTimeLeft(calculateTimeRemaining(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  return (
    <section className="invitation-section reveal-on-scroll" aria-label="Contagem Regressiva">
      <div className="invitation-container-narrow">
        <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
          <RoyalCrestOrnament width={170} />
          <span className="section-eyebrow">
            <Crown size={13} />
            Contagem Real
          </span>
          <h2 className="section-title">
            {countdown.title}
          </h2>
          <p className="section-subtitle" style={{ marginBottom: "var(--space-md)" }}>
            Cada segundo nos aproxima de celebrar a doce chegada da nossa pequena {eventSettings.babyName}!
          </p>
        </div>

        {timeLeft.isFinished ? (
          <div className="floral-welcome-card">
            <Sparkles size={24} color="var(--color-gold)" style={{ margin: "0 auto 8px auto" }} />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", color: "var(--color-pink-deep)", fontWeight: 700 }}>
              {countdown.finishedText}
            </p>
          </div>
        ) : (
          <div className="floral-countdown-grid" role="timer" aria-live="polite">
            <div className="floral-countdown-box">
              <span className="countdown-crown-dot" aria-hidden="true">✦</span>
              <span className="countdown-number">{padZero(timeLeft.days)}</span>
              <span className="countdown-label">{countdown.labels.days}</span>
            </div>
            <div className="floral-countdown-box">
              <span className="countdown-crown-dot" aria-hidden="true">✦</span>
              <span className="countdown-number">{padZero(timeLeft.hours)}</span>
              <span className="countdown-label">{countdown.labels.hours}</span>
            </div>
            <div className="floral-countdown-box">
              <span className="countdown-crown-dot" aria-hidden="true">✦</span>
              <span className="countdown-number">{padZero(timeLeft.minutes)}</span>
              <span className="countdown-label">{countdown.labels.minutes}</span>
            </div>
            <div className="floral-countdown-box floral-countdown-box-seconds">
              <span className="countdown-crown-dot" aria-hidden="true">✨</span>
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
