export interface GiftBoutiqueItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: "diapers" | "clothes" | "care";
  iconName: "Sparkles" | "Heart" | "Gift";
}

export interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  relation?: string;
  submittedAt: string;
}

export interface InvitationContent {
  meta: {
    title: string;
    description: string;
  };
  event: {
    name: string;
    babyName: string;
    subtitle: string;
    tagline: string;
    targetDate: string;
    dateFormatted: string;
    timeFormatted: string;
    locationName: string;
    locationAddress: string;
    locationCity: string;
    mapUrl?: string;
    pixKey: string;
    pixBeneficiary: string;
    observations: string;
  };
  sections: {
    hero: {
      preTitle: string;
      babyName: string;
      subtitle: string;
      scrollHint: string;
    };
    welcome: {
      title: string;
      greeting: string;
      badge: string;
      paragraphs: string[];
    };
    countdown: {
      title: string;
      labels: {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
      };
      finishedText: string;
    };
    details: {
      title: string;
      subtitle: string;
      dateLabel: string;
      timeLabel: string;
      locationLabel: string;
      observationsLabel: string;
    };
    rsvp: {
      title: string;
      subtitle: string;
      confirmPrompt: string;
      acceptButtonText: string;
      declineButtonText: string;
      modalTitle: string;
      modalMessage: string;
      closeModalText: string;
    };
    memories: {
      title: string;
      headline: string;
      description: string;
      privacyNote: string;
      buttonText: string;
      modalTitle: string;
      modalMessage: string;
    };
    gifts: {
      title: string;
      subtitle: string;
      message: string;
      pixNotice: string;
      suggestions: Array<{
        category: string;
        description: string;
        iconName: "Gift" | "Sparkles" | "Heart";
      }>;
      boutiqueItems: GiftBoutiqueItem[];
    };
    closing: {
      message: string;
      signature: string;
      babyName: string;
    };
  };
  seedGuestbook: GuestbookEntry[];
}

export const invitationContent: InvitationContent = {
  meta: {
    title: "Chá de Fraldas da Maytê — Nossa Pequena Princesa",
    description: "Convite real interativo para o Chá de Fraldas da Maytê. Venha celebrar conosco a chegada da nossa princesinha.",
  },
  event: {
    name: "Chá de Fraldas",
    babyName: "Maytê",
    subtitle: "Chá de Bebê da Nossa Pequena Princesa",
    tagline: "Maytê já é muito amada e, com você, nossa alegria será ainda maior. Junte-se a nós para dar as boas-vindas à nossa princesinha!",
    targetDate: "2026-11-22T15:30:00",
    dateFormatted: "Domingo, 22 de Novembro de 2026",
    timeFormatted: "A partir das 15h30",
    locationName: "Espaço Jardim das Flores",
    locationAddress: "Av. das Rosas, 1234 — Salão Nobre",
    locationCity: "São Paulo — SP",
    mapUrl: "https://maps.google.com/?q=Av.+Paulista,+1000,+Sao+Paulo",
    pixKey: "chadamayte@familia.com.br",
    pixBeneficiary: "Papais da Maytê",
    observations: "Será um encontro real muito especial! Venham preparados para comemorar, brindar e registrar muitas fotos para o álbum da nossa princesinha.",
  },
  sections: {
    hero: {
      preTitle: "Convite Real",
      babyName: "Maytê",
      subtitle: "Chá de Bebê da Nossa Pequena Princesa",
      scrollHint: "Deslize pelos detalhes reais",
    },
    welcome: {
      title: "Chá de Fraldas da Maytê",
      greeting: "Queridos amigos e familiares,",
      badge: "✨ A contagem regressiva para o nosso reino começou! ✨",
      paragraphs: [
        "O Chá de Fraldas da nossa pequena Maytê está sendo preparado com todo o amor, delicadeza e carinho do mundo.",
        "A presença de cada um de vocês é indispensável para enchermos esse dia de sorrisos, abraços e memórias que um dia mostraremos com orgulho à nossa princesinha.",
      ],
    },
    countdown: {
      title: "Contagem Regressiva Real",
      labels: {
        days: "Dias",
        hours: "Horas",
        minutes: "Minutos",
        seconds: "Segundos",
      },
      finishedText: "O grande dia chegou! Estamos celebrando a chegada da nossa princesa Maytê!",
    },
    details: {
      title: "Programação & Local",
      subtitle: "Preparamos cada detalhe para receber você e sua família com todo conforto e carinho.",
      dateLabel: "Data da Celebração",
      timeLabel: "Recepção dos Convidados",
      locationLabel: "Salão & Endereço",
      observationsLabel: "Dica Real aos Convidados",
    },
    rsvp: {
      title: "Confirmação de Presença Real",
      subtitle: "Confirme sua presença abaixo e receba seu Cartão VIP do Chá da Maytê!",
      confirmPrompt: "Você poderá estar conosco para celebrar a chegada da Maytê?",
      acceptButtonText: "SIM, CONFIRMAR PRESENÇA REAL! ✨",
      declineButtonText: "NÃO PODEREI COMPARECER",
      modalTitle: "Presença Confirmada!",
      modalMessage: "Recebemos a sua confirmação com muita alegria! Seu Cartão Real de Presença está pronto.",
      closeModalText: "Concluir com carinho",
    },
    memories: {
      title: "Álbum Real & Cápsula do Tempo",
      headline: "Eternize um momento ou deixe uma mensagem para a Maytê!",
      description: "Envie fotos especiais para a galeria dos papais e confira o mural de carinho que estamos guardando para a nossa princesa ler no futuro.",
      privacyNote: "✨ As fotos enviadas vão direto para o baú de memórias dos papais da Maytê!",
      buttonText: "REVELAR FOTO EM POLAROID DOURADA",
      modalTitle: "Memória Guardada no Reino!",
      modalMessage: "Recebemos sua foto com muito amor! Ela já faz parte do álbum especial da Maytê.",
    },
    gifts: {
      title: "Boutique de Mimos da Maytê",
      subtitle: "Sua presença já é o nosso maior presente! Se desejar mimar a nossa princesinha, escolha um item abaixo para vincular à sua confirmação ou utilize o Mimo via PIX:",
      message: "Marcas sugeridas com carinho: Pampers Confort Sec / Premium Care ou Huggies Supreme Care.",
      pixNotice: "Mimo Real via PIX — Prático, rápido e cheio de carinho",
      suggestions: [
        {
          category: "Fraldas & Higiene",
          description: "Fraldas tamanhos M ou G, lenços umedecidos e pomadinhas delicadas.",
          iconName: "Sparkles",
        },
        {
          category: "Enxoval & Roupas",
          description: "Bodys de algodão, vestidos e macacões confortáveis (3 a 9 meses).",
          iconName: "Heart",
        },
        {
          category: "Brinquedos & Conforto",
          description: "Naninhas macias, mordedores sensoriais e mantinhas em rosa ou branco.",
          iconName: "Gift",
        },
      ],
      boutiqueItems: [
        {
          id: "mimo-fralda-m-lenco",
          title: "Pacote Fralda Tam. M + Lenço Umedecido",
          subtitle: "Ideal para os primeiros meses de descobertas da Maytê",
          tag: "Mais Escolhido ✨",
          category: "diapers",
          iconName: "Sparkles",
        },
        {
          id: "mimo-fralda-g-pomada",
          title: "Pacote Fralda Tam. G + Pomada Preventiva",
          subtitle: "Cuidado prolongado com máximo conforto para a bebê",
          tag: "Super Útil 👑",
          category: "diapers",
          iconName: "Sparkles",
        },
        {
          id: "mimo-fralda-xg-sabonete",
          title: "Pacote Fralda Tam. XG + Sabonete Líquido",
          subtitle: "Para a fase dos primeiros passinhos com perfume suave",
          tag: "Carinho Especial 🌸",
          category: "diapers",
          iconName: "Sparkles",
        },
        {
          id: "mimo-lookinho-princesa",
          title: "Lookinho Princesa (3 a 9 meses)",
          subtitle: "Body rendado, macacão em tons pastel ou sapatinho delicado",
          tag: "Charme Real 🎀",
          category: "clothes",
          iconName: "Heart",
        },
        {
          id: "mimo-kit-banho",
          title: "Kit Hora do Banho & Perfume",
          subtitle: "Toalha fralda bordada, colônia infantil ou escovinha de cerdas macias",
          tag: "Doce Cuidado 🛁",
          category: "care",
          iconName: "Gift",
        },
        {
          id: "mimo-naninha-pelucia",
          title: "Naninha Real ou Mantinha Pérola",
          subtitle: "Para acompanhar os soninhos mais doces da nossa pequena",
          tag: "Aconchego 🤍",
          category: "care",
          iconName: "Heart",
        },
      ],
    },
    closing: {
      message: "Esperamos você com todo o nosso coração para celebrar a doce vida da nossa princesa Maytê!",
      signature: "Com todo o nosso amor,",
      babyName: "Papais da Maytê",
    },
  },
  seedGuestbook: [
    {
      id: "seed-1",
      author: "Vovós & Vovôs Corujas",
      relation: "Família",
      message: "Nossa pequena princesa Maytê, já contamos os minutos para te pegar no colo e te encher de beijos! Que Deus abençoe sua chegada com muita luz.",
      submittedAt: "2026-10-19T14:20:00Z",
    },
    {
      id: "seed-2",
      author: "Titia & Dindos",
      relation: "Padrinhos",
      message: "Nosso coração já transborda de amor por você, Maytê! Estaremos sempre ao seu lado em cada passo desse reino encantado.",
      submittedAt: "2026-10-20T10:15:00Z",
    },
    {
      id: "seed-3",
      author: "Amigos da Família",
      relation: "Amigos Queridos",
      message: "Que alegria celebrar essa bênção! Que o Chá da Maytê seja inesquecível e repleto do mesmo carinho que vocês espalham por onde passam.",
      submittedAt: "2026-10-20T18:30:00Z",
    },
  ],
};
