export type PortalLifecycleStage = "BABY_SHOWER" | "WAITING_BIRTH" | "MAYTE_BORN";

export interface DraggableCrownBlessing {
  id: string;
  text: string;
  enabled: boolean;
}

export interface DraggableRsvpQuickMimo {
  id: string;
  category: string;
  label: string;
  enabled: boolean;
}

export interface DraggableCustomQuestion {
  id: string;
  label: string;
  placeholder?: string;
  type: "TEXT" | "SELECT_PILLS";
  options?: string[];
  required: boolean;
  enabled: boolean;
}

export interface DraggableInspirationQuote {
  id: string;
  text: string;
  enabled: boolean;
}

export interface DraggableGiftItem {
  id: string;
  title: string;
  category: string;
  description: string;
  highlight: boolean;
  enabled: boolean;
}

export interface DraggablePortalSection {
  id: string;
  key: "welcome" | "details" | "gifts" | "rsvp" | "memories";
  title: string;
  subtitle: string;
  enabled: boolean;
}

export interface MayteBirthInfo {
  birthDateIso: string;
  birthDateFormatted: string;
  weightGrams: string;
  heightCm: string;
  hospitalName: string;
  cityState: string;
  announcementBadge: string;
  announcementTitle: string;
  announcementMessage: string;
  babyPhotoUrl: string;
}

export interface PortalDynamicConfig {
  lifecycleStage: PortalLifecycleStage;
  rsvpDeadlineFormatted: string;
  expectedBirthDate: string;
  expectedBirthFormatted: string;
  welcomeBadge: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeHighlightQuote: string;
  birthInfo: MayteBirthInfo;
  crownBlessings: DraggableCrownBlessing[];
  rsvpQuickMimos: DraggableRsvpQuickMimo[];
  customQuestions: DraggableCustomQuestion[];
  inspirationQuotes: DraggableInspirationQuote[];
  giftItems: DraggableGiftItem[];
  portalSections: DraggablePortalSection[];
}

export const defaultPortalDynamicConfig: PortalDynamicConfig = {
  lifecycleStage: "BABY_SHOWER",
  rsvpDeadlineFormatted: "Confirmar até 15 de Novembro de 2026",
  expectedBirthDate: "2027-01-15T09:00:00",
  expectedBirthFormatted: "Janeiro de 2027",
  welcomeBadge: "Com amor, esperamos por você",
  welcomeTitle: "A doce espera pela nossa Maytê",
  welcomeSubtitle:
    "Maytê já é muito amada e, com você, nossa alegria será ainda maior. Junte-se a nós para dar as boas-vindas à nossa princesinha!",
  welcomeHighlightQuote:
    "Celebre com a gente o chá de fralda da nossa pequena Maytê! Sua presença é indispensável.",
  birthInfo: {
    birthDateIso: "2027-01-15T08:42:00",
    birthDateFormatted: "15 de Janeiro de 2027 • 08h42",
    weightGrams: "3.280 g",
    heightCm: "49 cm",
    hospitalName: "Maternidade Real",
    cityState: "São Paulo — SP",
    announcementBadge: "👑 A Princesa Maytê Chegou ao Mundo! ✨",
    announcementTitle: "Bem-vinda à vida, nossa pequena Maytê!",
    announcementMessage:
      "Com o coração transbordando de gratidão, anunciamos a chegada da nossa princesinha! Este portal agora guarda para sempre todas as fotos, presenças, mimos e cartas da Cápsula do Tempo do seu Chá de Fraldas.",
    babyPhotoUrl: "/images/mayte-royal-crown.png",
  },
  crownBlessings: [
    { id: "cb_1", text: "✨ Toque na Coroa Real para enviar brilho à Maytê ✨", enabled: true },
    { id: "cb_2", text: "👑 Princesa Maytê • Nosso Maior Tesouro ✨", enabled: true },
    { id: "cb_3", text: "🌸 Esperando você com muito amor e carinho!", enabled: true },
    { id: "cb_4", text: "💛 Que a nossa pequena Maytê venha cheia de luz!", enabled: true },
    { id: "cb_5", text: "✨ Obrigado por fazer parte da nossa história real!", enabled: true },
  ],
  rsvpQuickMimos: [
    { id: "qm_1", category: "Primeiros Meses ✨", label: "Fralda Tam. M + Lenço", enabled: true },
    { id: "qm_2", category: "Super Útil 👑", label: "Fralda Tam. G + Pomada", enabled: true },
    { id: "qm_3", category: "3 a 9 Meses 🎀", label: "Lookinho Princesa", enabled: true },
    { id: "qm_4", category: "Escolha Livre 💝", label: "Mimo Surpresa / PIX", enabled: true },
  ],
  customQuestions: [
    {
      id: "cq_diet",
      label: "Restrição alimentar ou preferência para a recepção?",
      type: "SELECT_PILLS",
      options: ["Nenhuma", "Sem Lactose", "Vegetariano(a)", "Sem Glúten"],
      required: false,
      enabled: true,
    },
    {
      id: "cq_birth_guess",
      label: "Palpite Real: Que dia você acha que a Maytê vai nascer?",
      placeholder: "Ex: 14 de Janeiro • Cheia de saúde ✨",
      type: "TEXT",
      required: false,
      enabled: true,
    },
  ],
  inspirationQuotes: [
    {
      id: "iq_1",
      text: "Que a princesa Maytê venha com muita saúde e ilumine ainda mais essa família linda! ✨",
      enabled: true,
    },
    {
      id: "iq_2",
      text: "Contando os dias para celebrar esse momento mágico com vocês! 👑💖",
      enabled: true,
    },
    {
      id: "iq_3",
      text: "Maytê, você já é muito amada por todos nós! Que sua vida seja um jardim de alegria. 🌸",
      enabled: true,
    },
  ],
  giftItems: [
    {
      id: "gift-fralda-rn",
      title: "Fraldas RN ou P + Mimo",
      category: "0 a 2 Meses",
      description: "Para os primeiros dias da nossa princesinha (sugestão: Pampers Confort Sec ou Huggies Supreme Care).",
      highlight: false,
      enabled: true,
    },
    {
      id: "gift-fralda-m",
      title: "Fraldas Tamanho M + Lenços",
      category: "2 a 5 Meses • Muito Útil",
      description: "A fase em que a Maytê mais vai usar! Pacote de fraldas M acompanhado de lencinhos umedecidos.",
      highlight: true,
      enabled: true,
    },
    {
      id: "gift-fralda-g",
      title: "Fraldas Tamanho G + Pomadinha",
      category: "6+ Meses • Estoque Real",
      description: "Para garantir o conforto da nossa bebê por muitos meses, junto com pomada preventiva (Bepantol Baby / Mustela).",
      highlight: true,
      enabled: true,
    },
    {
      id: "gift-lookinho",
      title: "Lookinho Princesa (3 a 9 meses)",
      category: "Enxoval Real",
      description: "Vestidinhos, bodies de algodão egípcio, conjuntinhos ou sapatinhos delicados em tons rosê, creme ou branco.",
      highlight: false,
      enabled: true,
    },
    {
      id: "gift-banho",
      title: "Kit Hora do Banho & Cheirinho",
      category: "Cuidados Delicados",
      description: "Sabonete líquido da cabeça aos pés, colônia sem álcool, toalha fralda macia ou escovinha de cerdas naturais.",
      highlight: false,
      enabled: true,
    },
    {
      id: "gift-livre",
      title: "Carinho Livre ou PIX para o Enxoval",
      category: "Escolha Livre",
      description: "Sinta-se totalmente à vontade para escolher qualquer lembrancinha de coração ou contribuir via PIX abaixo.",
      highlight: false,
      enabled: true,
    },
  ],
  portalSections: [
    { id: "sec_welcome", key: "welcome", title: "Carta de Boas-Vindas", subtitle: "Mensagem carinhosa dos papais", enabled: true },
    { id: "sec_details", key: "details", title: "Contagem Regressiva & Local", subtitle: "Relógio ao vivo, data e GPS do salão", enabled: true },
    { id: "sec_gifts", key: "gifts", title: "Boutique Real de Mimos & PIX", subtitle: "Vitrine de fraldas, sugestões e chave PIX", enabled: true },
    { id: "sec_rsvp", key: "rsvp", title: "Cartão de Resposta Real (R.S.V.P.)", subtitle: "Confirmação de presença e perguntas", enabled: true },
    { id: "sec_memories", key: "memories", title: "Álbum Polaroid & Cápsula do Tempo", subtitle: "Envio de fotos e mural de recados", enabled: true },
  ],
};

export function mergePortalDynamicConfig(
  raw?: Partial<PortalDynamicConfig> | null
): PortalDynamicConfig {
  if (!raw) return defaultPortalDynamicConfig;
  return {
    lifecycleStage: raw.lifecycleStage || defaultPortalDynamicConfig.lifecycleStage,
    rsvpDeadlineFormatted:
      raw.rsvpDeadlineFormatted ?? defaultPortalDynamicConfig.rsvpDeadlineFormatted,
    expectedBirthDate: raw.expectedBirthDate || defaultPortalDynamicConfig.expectedBirthDate,
    expectedBirthFormatted:
      raw.expectedBirthFormatted || defaultPortalDynamicConfig.expectedBirthFormatted,
    welcomeBadge: raw.welcomeBadge || defaultPortalDynamicConfig.welcomeBadge,
    welcomeTitle: raw.welcomeTitle || defaultPortalDynamicConfig.welcomeTitle,
    welcomeSubtitle: raw.welcomeSubtitle || defaultPortalDynamicConfig.welcomeSubtitle,
    welcomeHighlightQuote:
      raw.welcomeHighlightQuote || defaultPortalDynamicConfig.welcomeHighlightQuote,
    birthInfo: {
      ...defaultPortalDynamicConfig.birthInfo,
      ...(raw.birthInfo || {}),
    },
    crownBlessings:
      Array.isArray(raw.crownBlessings) && raw.crownBlessings.length > 0
        ? raw.crownBlessings
        : defaultPortalDynamicConfig.crownBlessings,
    rsvpQuickMimos:
      Array.isArray(raw.rsvpQuickMimos) && raw.rsvpQuickMimos.length > 0
        ? raw.rsvpQuickMimos
        : defaultPortalDynamicConfig.rsvpQuickMimos,
    customQuestions:
      Array.isArray(raw.customQuestions)
        ? raw.customQuestions
        : defaultPortalDynamicConfig.customQuestions,
    inspirationQuotes:
      Array.isArray(raw.inspirationQuotes) && raw.inspirationQuotes.length > 0
        ? raw.inspirationQuotes
        : defaultPortalDynamicConfig.inspirationQuotes,
    giftItems:
      Array.isArray(raw.giftItems) && raw.giftItems.length > 0
        ? raw.giftItems
        : defaultPortalDynamicConfig.giftItems,
    portalSections:
      Array.isArray(raw.portalSections) && raw.portalSections.length > 0
        ? raw.portalSections
        : defaultPortalDynamicConfig.portalSections,
  };
}

export type PolaroidCategoryKey = "all" | "cha" | "gestacao" | "familia" | "mayte";

export interface PolaroidCategoryDef {
  key: PolaroidCategoryKey;
  label: string;
  shortBadge: string;
}

export const POLAROID_CATEGORIES: PolaroidCategoryDef[] = [
  { key: "all", label: "Todas as Memórias", shortBadge: "Acervo Real ✨" },
  { key: "cha", label: "Chá de Fraldas 👑", shortBadge: "Chá de Fraldas 👑" },
  { key: "gestacao", label: "Doce Espera 🤰", shortBadge: "Doce Espera 🤰" },
  { key: "familia", label: "Família & Amigos 💖", shortBadge: "Família & Amigos 💖" },
  { key: "mayte", label: "Princesa Maytê 🌸", shortBadge: "Princesa Maytê 🌸" },
];

export interface VintagePolaroidItem {
  id: string;
  url: string;
  caption: string;
  category: Exclude<PolaroidCategoryKey, "all">;
  dateStamp: string;
  rotationDeg: number;
  isSeed?: boolean;
}

export const SEED_VINTAGE_POLAROIDS: VintagePolaroidItem[] = [
  {
    id: "seed-pol-1",
    url: "/images/mayte-royal-crown.png",
    caption: "A coroa real preparada com amor para a nossa princesinha Maytê ✨",
    category: "cha",
    dateStamp: "22 • NOV • 2026",
    rotationDeg: -2.4,
    isSeed: true,
  },
  {
    id: "seed-pol-2",
    url: "/images/mayte-floral-crown-emblem.png",
    caption: "Cada flor e detalhe sonhado durante a doce espera da Maytê 🌸",
    category: "gestacao",
    dateStamp: "OUT • 2026",
    rotationDeg: 2.1,
    isSeed: true,
  },
  {
    id: "seed-pol-3",
    url: "/images/mayte-polaroid-family.png",
    caption: "Celebrando com a família e amigos o Chá de Fraldas da Maytê 💖",
    category: "familia",
    dateStamp: "22 • NOV • 2026",
    rotationDeg: -1.7,
    isSeed: true,
  },
  {
    id: "seed-pol-4",
    url: "/images/mayte-polaroid-princess.png",
    caption: "Nosso maior tesouro: esperando você, pequena princesa Maytê! 👑",
    category: "mayte",
    dateStamp: "2026 • ETERNIDADE",
    rotationDeg: 2.3,
    isSeed: true,
  },
];

export function formatPolaroidCaptionWithCategory(
  caption: string,
  category: Exclude<PolaroidCategoryKey, "all">
): string {
  const clean = caption.replace(/^\[cat:[a-z]+\]\s*/i, "").trim();
  return `[cat:${category}] ${clean || "Recordação Real da Maytê ✨"}`;
}

export function parsePolaroidCaption(rawFilename: string): {
  category: Exclude<PolaroidCategoryKey, "all">;
  caption: string;
} {
  const withoutExt = rawFilename.replace(/\.[a-zA-Z0-9]+$/, "").trim();
  const match = withoutExt.match(/^\[cat:(cha|gestacao|familia|mayte)\]\s*(.*)$/i);
  if (match) {
    const cat = (match[1]?.toLowerCase() || "cha") as Exclude<PolaroidCategoryKey, "all">;
    const cap = (match[2] || "").trim() || "Recordação Real da Maytê ✨";
    return { category: cat, caption: cap };
  }
  return {
    category: "cha",
    caption: withoutExt || "Recordação Real da Maytê ✨",
  };
}

