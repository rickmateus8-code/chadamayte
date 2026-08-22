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
    targetDate: string; // ISO 8601 string for countdown
    dateFormatted: string;
    timeFormatted: string;
    locationName: string;
    locationAddress: string;
    locationCity: string;
    mapUrl?: string;
  };
  sections: {
    hero: {
      crownAlt: string;
      preTitle: string;
      babyName: string;
      subtitle: string;
      scrollHint: string;
    };
    intro: {
      headline: string;
      quote: string;
      author: string;
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
    };
    location: {
      title: string;
      subtitle: string;
      buttonText: string;
      note: string;
    };
    specialMessage: {
      title: string;
      content: string[];
    };
    gallery: {
      title: string;
      subtitle: string;
      placeholders: Array<{
        id: string;
        title: string;
        caption: string;
      }>;
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
    closing: {
      message: string;
      signature: string;
      babyName: string;
    };
  };
}

export const invitationContent: InvitationContent = {
  meta: {
    title: "Chá de Bebê da Maytê — Convite Especial",
    description: "Celebre conosco a chegada da pequena princesa Maytê. Uma experiência cheia de amor e delicadeza.",
  },
  event: {
    name: "Chá de Bebê",
    babyName: "Maytê",
    subtitle: "A chegada da nossa pequena princesa",
    tagline: "Uma pequena princesa está chegando para transformar nossas vidas com amor e luz.",
    targetDate: "2026-10-18T15:30:00", // Placeholder configurável para data do evento
    dateFormatted: "18 de Outubro de 2026",
    timeFormatted: "A partir das 15h30",
    locationName: "Espaço Jardim das Flores",
    locationAddress: "Av. das Rosas, 1234 — Salão Nobre (Placeholder)",
    locationCity: "São Paulo — SP",
    mapUrl: "", // Opcional — se vazio, o botão exibe aviso amigável sem quebrar
  },
  sections: {
    hero: {
      crownAlt: "Coroa Dourada da Princesa Maytê",
      preTitle: "Chá de Bebê",
      babyName: "Maytê",
      subtitle: "Uma pequena princesa está chegando para transformar nossas vidas.",
      scrollHint: "Deslize para ver o convite",
    },
    intro: {
      headline: "Esperando Nosso Maior Presente",
      quote: "Um amor que já é infinito antes mesmo do primeiro abraço.",
      author: "Com amor, Papai & Mamãe",
    },
    countdown: {
      title: "Contagem Regressiva para a Nossa Princesa",
      labels: {
        days: "Dias",
        hours: "Horas",
        minutes: "Min",
        seconds: "Seg",
      },
      finishedText: "O grande dia chegou! Estamos celebrando a nossa Maytê!",
    },
    details: {
      title: "Informações do Evento",
      subtitle: "Reserve esse dia no seu coração e na sua agenda para celebrar com a gente",
      dateLabel: "Data",
      timeLabel: "Horário",
      locationLabel: "Local",
    },
    location: {
      title: "Como Chegar",
      subtitle: "Esperamos você em um ambiente preparado com todo carinho",
      buttonText: "Abrir no Mapa",
      note: "Estacionamento com serviço de valet disponível no local.",
    },
    specialMessage: {
      title: "Mensagem com Carinho",
      content: [
        "Cada detalhe deste dia está sendo preparado com muito carinho para que você compartilhe dessa alegria com a nossa família.",
        "Sua presença e seu abraço são os melhores presentes que a Maytê pode receber ao iniciar sua linda jornada no mundo.",
      ],
    },
    gallery: {
      title: "Momentos de Espera",
      subtitle: "Pequenos registros do início de uma história de amor incondicional",
      placeholders: [
        { id: "1", title: "O Começo do Sonho", caption: "Primeiros batimentos e a descoberta da nossa princesa" },
        { id: "2", title: "Crescendo com Amor", caption: "A cada semana, mais amor preenche nosso lar" },
        { id: "3", title: "O Quartinho Real", caption: "Preparando o castelo onde a Maytê vai sonhar" },
      ],
    },
    gifts: {
      title: "Sugestões de Presentes",
      subtitle: "O maior presente é a sua presença. Se desejar mimar nossa princesa, preparamos algumas ideias com carinho.",
      message: "Fraldas (tamanhos M e G), roupinhas delicadas ou itens de cuidados para bebê.",
      pixNotice: "Opção de lista virtual e PIX estarão disponíveis em breve.",
      suggestions: [
        {
          category: "Cuidados & Higiene",
          description: "Fraldas tamanhos M ou G, toalhinhas umedecidas e sabonetes suaves.",
          iconName: "Sparkles",
        },
        {
          category: "Roupas & Conforto",
          description: "Bodys, macacõezinhos delicados (3 a 9 meses) e mantas macias.",
          iconName: "Heart",
        },
        {
          category: "Mimos & Brincadeiras",
          description: "Mordedores, chocalhos e livrinhos sensoriais para os primeiros meses.",
          iconName: "Gift",
        },
      ],
    },
    rsvp: {
      title: "Confirmação de Presença",
      subtitle: "Para que possamos preparar tudo com perfeição, confirme sua presença até 05 de Outubro.",
      confirmPrompt: "Você poderá estar conosco para celebrar a chegada da Maytê?",
      acceptButtonText: "Sim, estarei presente!",
      declineButtonText: "Infelizmente não poderei ir",
      modalTitle: "Confirmação de Presença",
      modalMessage: "Obrigado pelo carinho! O formulário completo com lista de convidados e acompanhantes será aberto oficialmente na próxima fase.",
      closeModalText: "Entendi com carinho",
    },
    closing: {
      message: "Com todo o nosso carinho e gratidão, esperamos você para celebrar a chegada da nossa doce Maytê.",
      signature: "Com amor,",
      babyName: "Família da Maytê",
    },
  },
};