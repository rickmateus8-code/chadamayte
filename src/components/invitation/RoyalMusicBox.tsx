import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

// Delicate Royal Music Box / Celesta Lullaby notes (Brahms / Royal Berceuse motif in C Major)
const LULLABY_SEQUENCE: Array<{ freq: number; duration: number; harmony?: number }> = [
  { freq: 659.25, duration: 0.55, harmony: 523.25 }, // E5 + C5
  { freq: 659.25, duration: 0.55 },                  // E5
  { freq: 783.99, duration: 1.1, harmony: 523.25 },  // G5 + C5
  { freq: 659.25, duration: 0.55 },                  // E5
  { freq: 659.25, duration: 0.55 },                  // E5
  { freq: 783.99, duration: 1.1, harmony: 523.25 },  // G5 + C5
  { freq: 659.25, duration: 0.45 },                  // E5
  { freq: 783.99, duration: 0.45 },                  // G5
  { freq: 1046.5, duration: 0.9, harmony: 659.25 },  // C6 + E5
  { freq: 987.77, duration: 0.8, harmony: 587.33 },  // B5 + D5
  { freq: 880.0, duration: 0.9, harmony: 523.25 },   // A5 + C5
  { freq: 880.0, duration: 0.7 },                    // A5
  { freq: 783.99, duration: 1.1, harmony: 493.88 },  // G5 + B4
  { freq: 587.33, duration: 0.55 },                  // D5
  { freq: 659.25, duration: 0.55 },                  // E5
  { freq: 698.46, duration: 0.9, harmony: 440.0 },   // F5 + A4
  { freq: 587.33, duration: 0.8 },                   // D5
  { freq: 659.25, duration: 0.55 },                  // E5
  { freq: 698.46, duration: 0.55 },                  // F5
  { freq: 783.99, duration: 1.1, harmony: 523.25 },  // G5 + C5
  { freq: 659.25, duration: 0.55 },                  // E5
  { freq: 587.33, duration: 0.55, harmony: 493.88 }, // D5 + B4
  { freq: 523.25, duration: 1.5, harmony: 392.0 },   // C5 + G4
];

export const RoyalMusicBox: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const noteIdxRef = useRef<number>(0);

  const playBellNote = useCallback((ctx: AudioContext, freq: number, duration: number, volume = 0.055) => {
    const now = ctx.currentTime;

    // Primary sine chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Subtle overtone for celesta / music-box sparkle
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.65);

    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(volume * 0.2, now + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);

    overtone.connect(overtoneGain);
    overtoneGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration * 1.7);
    overtone.start(now);
    overtone.stop(now + duration * 0.75);
  }, []);

  const scheduleNextNote = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const item = LULLABY_SEQUENCE[noteIdxRef.current % LULLABY_SEQUENCE.length] ?? {
      freq: 659.25,
      duration: 0.55,
    };
    playBellNote(ctx, item.freq, item.duration, 0.05);
    if (item.harmony) {
      playBellNote(ctx, item.harmony, item.duration * 1.2, 0.025);
    }

    noteIdxRef.current = (noteIdxRef.current + 1) % LULLABY_SEQUENCE.length;
    timerRef.current = window.setTimeout(scheduleNextNote, item.duration * 680);
  }, [playBellNote]);

  const startMusic = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setIsPlaying(true);
      scheduleNextNote();
    } catch {
      // Ignore audio restriction errors
    }
  }, [scheduleNextNote]);

  const stopMusic = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  useEffect(() => {
    const handleStartEvent = () => {
      if (!isPlaying) {
        startMusic();
      }
    };
    window.addEventListener("mayte:start-music", handleStartEvent);
    return () => {
      window.removeEventListener("mayte:start-music", handleStartEvent);
    };
  }, [isPlaying, startMusic]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className={`royal-music-fab ${isPlaying ? "is-playing" : ""}`}
      aria-label={isPlaying ? "Pausar melodia da caixinha de música" : "Tocar melodia da caixinha de música"}
      title={isPlaying ? "Pausar Caixinha de Música Real" : "Tocar Caixinha de Música Real"}
    >
      <span className="royal-music-fab-icon">
        {isPlaying ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </span>
      <span className="royal-music-fab-label">
        <Sparkles size={11} />
        {isPlaying ? "Melodia Real" : "Música"}
      </span>
    </button>
  );
};
