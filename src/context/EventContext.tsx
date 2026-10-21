import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { invitationContent, type GuestbookEntry } from "../config/invitationContent";
import {
  defaultPortalDynamicConfig,
  mergePortalDynamicConfig,
  type PortalDynamicConfig,
} from "../config/portalConfig";

export interface PersonalizedInvitationData {
  invitation: {
    id: string;
    displayName: string;
    salutation?: string;
    allowAdditionalGuests: boolean;
    maxAdditionalGuests: number;
  };
  guests: Array<{
    id: string;
    name: string;
    guestType?: "ADULT" | "CHILD" | "BABY";
    isPrimary: boolean;
  }>;
  rsvp: {
    data: {
      id: string;
      status: string;
      contactName: string;
      contactWhatsapp?: string;
      notes?: string;
      guestCount: number;
    };
    members?: Array<{
      id: string;
      guestId?: string | null;
      displayName: string;
      attendanceStatus: "CONFIRMED" | "DECLINED";
      isAdditionalGuest: boolean;
      guestType: "ADULT" | "CHILD" | "BABY";
    }>;
  } | null;
}

export interface LiveEventSettings {
  name: string;
  babyName: string;
  targetDate: string;
  dateFormatted: string;
  timeFormatted: string;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  mapUrl: string;
  pixKey: string;
  pixBeneficiary: string;
  observations: string;
}

export interface PublicPolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
}

interface EventContextValue {
  eventSettings: LiveEventSettings;
  portalConfig: PortalDynamicConfig;
  invitationData: PersonalizedInvitationData | null;
  loadingInvitation: boolean;
  selectedMimos: string[];
  toggleMimo: (mimoTitle: string) => void;
  guestbook: GuestbookEntry[];
  addGuestbookMessage: (author: string, message: string) => void;
  publicPhotos: PublicPolaroidPhoto[];
  isEnvelopeOpen: boolean;
  openEnvelope: () => void;
  reopenEnvelope: () => void;
  refreshEventInfo: () => Promise<void>;
}

const defaultEventSettings: LiveEventSettings = {
  name: invitationContent.event.name,
  babyName: invitationContent.event.babyName,
  targetDate: invitationContent.event.targetDate,
  dateFormatted: invitationContent.event.dateFormatted,
  timeFormatted: invitationContent.event.timeFormatted,
  locationName: invitationContent.event.locationName,
  locationAddress: invitationContent.event.locationAddress,
  locationCity: invitationContent.event.locationCity,
  mapUrl: invitationContent.event.mapUrl || "",
  pixKey: invitationContent.event.pixKey,
  pixBeneficiary: invitationContent.event.pixBeneficiary,
  observations: invitationContent.event.observations,
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

export function stripStructuredRsvpTags(raw: string): string {
  return raw
    .replace(/\s*\[Mimos?:.*?\]/gi, "")
    .replace(/\s*\[Respostas?:.*?\]/gi, "")
    .trim();
}

export const EventProvider: React.FC<{
  token?: string;
  children: React.ReactNode;
}> = ({ token, children }) => {
  const [eventSettings, setEventSettings] = useState<LiveEventSettings>(defaultEventSettings);
  const [portalConfig, setPortalConfig] = useState<PortalDynamicConfig>(defaultPortalDynamicConfig);
  const [invitationData, setInvitationData] = useState<PersonalizedInvitationData | null>(null);
  const [loadingInvitation, setLoadingInvitation] = useState<boolean>(Boolean(token));
  const [selectedMimos, setSelectedMimos] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem("mayte_selected_mimos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(invitationContent.seedGuestbook);
  const [publicPhotos, setPublicPhotos] = useState<PublicPolaroidPhoto[]>([]);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("mayte_envelope_opened") === "true";
    } catch {
      return false;
    }
  });

  const refreshEventInfo = useCallback(async () => {
    try {
      const res = await fetch("/api/public/event-info");
      if (!res.ok) return;
      const data = await res.json();
      if (data?.event) {
        setEventSettings((prev) => ({
          ...prev,
          ...data.event,
        }));
      }
      if (data?.portalConfig) {
        setPortalConfig(mergePortalDynamicConfig(data.portalConfig));
      }
      if (Array.isArray(data?.guestbook)) {
        const dbEntries: GuestbookEntry[] = data.guestbook
          .map((item: any) => ({
            id: String(item.id),
            author: String(item.author),
            message: stripStructuredRsvpTags(String(item.message)),
            relation: "Convidado(a) Confirmado(a)",
            submittedAt: String(item.submittedAt),
          }))
          .filter((item: GuestbookEntry) => item.message.length > 0);

        setGuestbook([...dbEntries, ...invitationContent.seedGuestbook]);
      }
      if (Array.isArray(data?.publicPhotos)) {
        setPublicPhotos(data.publicPhotos);
      }
    } catch {
      // Fallback to default static config
    }
  }, []);

  useEffect(() => {
    refreshEventInfo();
  }, [refreshEventInfo]);

  useEffect(() => {
    if (!token) {
      setInvitationData(null);
      setLoadingInvitation(false);
      return;
    }

    setLoadingInvitation(true);
    fetch(`/api/invitations/${token}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PersonalizedInvitationData | null) => {
        if (data) {
          setInvitationData(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInvitation(false));
  }, [token]);

  const toggleMimo = useCallback((mimoTitle: string) => {
    setSelectedMimos((prev) => {
      const exists = prev.includes(mimoTitle);
      const next = exists ? prev.filter((item) => item !== mimoTitle) : [...prev, mimoTitle];
      try {
        sessionStorage.setItem("mayte_selected_mimos", JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const addGuestbookMessage = useCallback((author: string, message: string) => {
    const cleanMsg = stripStructuredRsvpTags(message);
    if (!cleanMsg) return;
    setGuestbook((prev) => [
      {
        id: `live-${Date.now()}`,
        author,
        relation: "Presença Confirmada ✨",
        message: cleanMsg,
        submittedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const openEnvelope = useCallback(() => {
    const applyOpen = () => {
      setIsEnvelopeOpen(true);
      try {
        sessionStorage.setItem("mayte_envelope_opened", "true");
      } catch {
        // Ignore
      }
    };

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !prefersReducedMotion
    ) {
      (document as any).startViewTransition(() => {
        applyOpen();
      });
    } else {
      applyOpen();
    }
  }, []);

  const reopenEnvelope = useCallback(() => {
    setIsEnvelopeOpen(false);
    try {
      sessionStorage.removeItem("mayte_envelope_opened");
    } catch {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <EventContext.Provider
      value={{
        eventSettings,
        portalConfig,
        invitationData,
        loadingInvitation,
        selectedMimos,
        toggleMimo,
        guestbook,
        addGuestbookMessage,
        publicPhotos,
        isEnvelopeOpen,
        openEnvelope,
        reopenEnvelope,
        refreshEventInfo,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export function useEventContext(): EventContextValue {
  const ctx = useContext(EventContext);
  if (!ctx) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return ctx;
}
