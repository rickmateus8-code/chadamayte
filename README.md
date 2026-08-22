# Chá de Bebê da Maytê

Nome interno: `mayte-baby-shower`

```text
Project root:
C:\Users\ricky\Desktop\Maytê Filha
```

## Objetivo do Produto

Aplicação full-stack para o **Chá de Bebê da Maytê**. A experiência final consiste em um convite virtual premium, delicado e responsivo com identidade visual baseada em tons de rosa, toques claros e detalhes em dourado com coroa, desenhado sob a filosofia mobile-first.

## Stack Oficial

- **Frontend**: React (v18+), TypeScript, Vite
- **Roteamento**: React Router DOM (v6+)
- **Ícones**: Lucide React
- **Backend / Edge Runtime**: Cloudflare Workers
- **Integração Vite**: Cloudflare Vite Plugin (`@cloudflare/vite-plugin`)
- **Banco de Dados**: Cloudflare D1 (SQL relacional serverless)
- **Armazenamento de Mídia**: Cloudflare R2 (Object Storage)
- **Deploy**: Cloudflare Workers / Pages

## Requisitos de Ambiente

- **Node.js**: v18+ (recomendado v20+)
- **npm** (Package Manager oficial do projeto)
- **Wrangler CLI**: v3+

## Instalação

```bash
cd "C:\Users\ricky\Desktop\Maytê Filha"
npm install
```

## Desenvolvimento Local

Para iniciar o servidor Vite com hot-reload e integração Cloudflare Workers:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

Para simular o ambiente Cloudflare Workers localmente:

```bash
npm run preview
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento (Vite + Cloudflare).
- `npm run build`: Gera o bundle estático e o bundle do worker para produção.
- `npm run preview`: Executa o runtime local do Cloudflare Workers via Wrangler.
- `npm run typecheck`: Validação estrita de tipos TypeScript no frontend.
- `npm run typecheck:worker`: Validação estrita de tipos TypeScript no Worker backend.
- `npm run check`: Validação estrita completa (frontend + worker).
- `npm run cf-typegen`: Gera definições de tipos para bindings do Cloudflare.

## Arquitetura e Separação de Responsabilidades

O projeto adota uma arquitetura estritamente modular e desacoplada:

- `src/app/`: Configuração principal da aplicação React e roteamento central.
- `src/components/`: Componentes visuais compartilhados (Header, cards, botões, modais).
- `src/features/`: Módulos de regras de negócio (RSVP, Convites, Galeria, CMS).
- `src/pages/public/`: Telas acessíveis aos convidados (ex: `/`).
- `src/pages/admin/`: Telas do painel administrativo (ex: `/admin`).
- `src/styles/`: Variáveis CSS de identidade visual e regras globais de layout.
- `src/lib/`: Utilitários e clientes de API para comunicação com `/api/*`.
- `src/types/`: Interfaces TypeScript compartilhadas no frontend.
- `worker/`: Backend serverless executado na borda (Cloudflare Worker).
  - `worker/routes/`: Handlers de endpoints HTTP (ex: `/api/health`).
  - `worker/middleware/`: Middlewares (CORS, validação, segurança).
  - `worker/services/`: Camada de serviços e regras de negócio do backend.
  - `worker/repositories/`: Camada de persistência (D1 / R2).
  - `worker/domain/`: Entidades de domínio e contratos de dados.
  - `worker/types/`: Tipagem de ambiente e bindings (`Env`).
- `migrations/`: Scripts SQL de migração estrutural para o Cloudflare D1.
- `public/`: Assets estáticos diretos (favicon, manifest, etc.).

## Estrutura de Pastas

```text
C:\Users\ricky\Desktop\Maytê Filha
│
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── components/
│   │   └── common/
│   │       └── Header.tsx
│   ├── features/
│   │   └── index.ts
│   ├── pages/
│   │   ├── public/
│   │   │   └── HomePage.tsx
│   │   └── admin/
│   │       └── AdminDashboardPage.tsx
│   ├── styles/
│   │   └── index.css
│   ├── lib/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   └── main.tsx
│
├── worker/
│   ├── index.ts
│   ├── routes/
│   │   ├── health.ts
│   │   └── index.ts
│   ├── middleware/
│   │   └── cors.ts
│   ├── services/
│   │   └── index.ts
│   ├── repositories/
│   │   └── index.ts
│   ├── domain/
│   │   └── index.ts
│   └── types/
│       └── env.ts
│
├── migrations/
│   └── 0000_initial.sql
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.worker.json
├── vite.config.ts
├── wrangler.jsonc
└── README.md
```

## Configuração Cloudflare e Bindings

Arquivo: `wrangler.jsonc`

Bindings configurados para suportar persistência e mídia:

| Binding | Tipo | Finalidade | Nome do Recurso | ID / Status |
|---|---|---|---|---|
| `DB` | Cloudflare D1 | Banco de dados relacional SQL | `mayte-baby-shower-db` | `PLACEHOLDER_D1_DATABASE_ID` |
| `MEDIA` | Cloudflare R2 | Armazenamento de imagens e assets | `mayte-baby-shower-media` | Pendente de criação no Cloudflare |
| `ASSETS` | Fetcher | Servir build estático da SPA | N/A | Automático via Wrangler |

### Placeholders Pendentes

Os identificadores reais abaixo serão vinculados após a criação autorizada dos recursos na conta Cloudflare:
- `database_id` no D1 (`PLACEHOLDER_D1_DATABASE_ID`)
- R2 Bucket `mayte-baby-shower-media`
- Cloudflare Account ID & Tokens

## Rotas Base (Fase 0)

- `/`: Página pública inicial (Shell temporário "Chá de Bebê da Maytê").
- `/admin`: Shell do painel administrativo.
- `/api/health`: Health check da API no Cloudflare Worker.
