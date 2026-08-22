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
    title: "Chá de Fraldas da Maytê — Nossa Pequena Princesa",
    description: "Convite especial para o Chá de Fraldas da Maytê. Venha celebrar conosco a chegada da nossa pequena princesa.",
  },
  event: {
    name: "Chá de Fraldas",
    babyName: "Maytê",
    subtitle: "Chá de Bebê da Nossa Pequena Princesa",
    tagline: "Uma linda história de amor está começando e queremos você ao nosso lado para celebrar!",
    targetDate: "2026-10-18T15:30:00",
    dateFormatted: "Domingo, 18 de Outubro de 2026",
    timeFormatted: "A partir das 15h30",
    locationName: "Espaço Jardim das Flores",
    locationAddress: "Av. das Rosas, 1234 — Salão Nobre",
    locationCity: "São Paulo — SP",
    mapUrl: "",
    observations: "Será um encontro muito especial, venham preparados para comemorar e registrar muitas fotos!",
  },
  sections: {
    hero: {
      preTitle: "Chá de Fraldas",
      babyName: "Maytê",
      subtitle: "Chá de Bebê da Nossa Pequena Princesa",
      scrollHint: "Deslize para ver o convite",
    },
    welcome: {
      title: "Chá de Fraldas da Maytê",
      greeting: "Olá, bem-vindos ao nosso Chá de Fraldas!",
      badge: "❤️ Queridos amigos e familiares ❤️",
      paragraphs: [
        "Este site foi criado para facilitar a organização do dia da Maytê.",
        "Estamos preparando tudo com muito carinho e cuidado para que esse dia seja cheio de lindas lembranças, que um dia poderão ser mostradas à Maytê com muito amor. ❤️",
      ],
    },
    countdown: {
      title: "Contagem Regressiva para a Festa",
      labels: {
        days: "Dias",
        hours: "Horas",
        minutes: "Min",
        seconds: "Seg",
      },
      finishedText: "O grande dia chegou! Estamos celebrando a nossa princesa Maytê!",
    },
    details: {
      title: "Informações do Evento",
      subtitle: "Os principais detalhes do evento reunidos aqui para você se planejar com tranquilidade.",
      dateLabel: "Data do Evento",
      timeLabel: "Horário",
      locationLabel: "Local & Endereço",
      observationsLabel: "Observações Importantes",
    },
    rsvp: {
      title: "Confirmar Presença",
      subtitle: "Confirme sua presença e participe de um momento inesquecível!",
      confirmPrompt: "Você poderá estar conosco para celebrar a chegada da Maytê?",
      acceptButtonText: "SIM, VOU AO EVENTO! ✓",
      declineButtonText: "NÃO PODEREI IR ✕",
      modalTitle: "Confirmação de Presença",
      modalMessage: "Recebemos o seu carinho! A lista nominal completa de confirmação será liberada com o envio individual dos convites.",
      closeModalText: "Entendi com carinho",
    },
    memories: {
      title: "Mural de Fotos & Memórias",
      headline: "Ei, convidado! Suas fotos podem fazer parte da festa!",
      description: "Ajude a contar a história do evento, enviando aos anfitriões seus registros para eternizar cada detalhe da comemoração.",
      privacyNote: "Ahhh... apenas os anfitriões verão suas fotos! 😊",
      buttonText: "ENVIAR MINHAS FOTOS",
      modalTitle: "Galeria dos Convidados",
      modalMessage: "No dia do evento este canal estará aberto para você fazer o upload das fotos tiradas durante a festa direto para os papais da Maytê!",
    },
    gifts: {
      title: "Sugestões de Presentes",
      subtitle: "Sua presença é o maior presente! Para quem desejar mimar a Maytê, preparamos algumas dicas com amor:",
      message: "Fraldas tamanhos M ou G, roupinhas delicadas ou itens de cuidados.",
      pixNotice: "Opção de presente via PIX e lista de fraldas virtual.",
      suggestions: [
        {
          category: "Fraldas & Higiene",
          description: "Fraldas tamanhos M ou G, lenços umedecidos e pomadinhas.",
          iconName: "Sparkles",
        },
        {
          category: "Roupas & Mimos",
          description: "Bodys e macacões confortáveis (3 a 9 meses) e meinhas.",
          iconName: "Heart",
        },
        {
          category: "Brinquedos & Conforto",
          description: "Naninhas, mordedores e mantas macias.",
          iconName: "Gift",
        },
      ],
    },
    closing: {
      message: "Esperamos você com todo o nosso coração para celebrar a doce vida da nossa Maytê!",
      signature: "Com muito amor e carinho,",
      babyName: "Família da Maytê",
    },
  },
};