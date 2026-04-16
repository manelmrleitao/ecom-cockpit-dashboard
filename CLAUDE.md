# Ecom Cockpit Dashboard

## Descrição

Dashboard centralizado que agrega dados de múltiplas plataformas de publicidade (Google Ads, Meta Ads, TikTok Ads) e conecta com Shopify para análise de performance em tempo real. Fornece visibilidade completa sobre ROI, custo por compra, ROAS e KPIs críticos de gestão de tráfego em um único cockpit.

## Stack

- **Frontend:** Next.js 14+ (App Router) + React + TypeScript
- **Backend:** Next.js API Routes + Node.js
- **Base de dados:** Supabase (PostgreSQL) — guardar credenciais, histórico de dados, cache de APIs
- **Deploy:** Vercel (frontend + backend integrado)
- **Styling:** Tailwind CSS + shadcn/ui para componentes
- **Análise:** TanStack Query para sincronização de dados, Recharts para gráficos

## Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Desenvolvimento (localhost:3000)
npm run dev

# Build de produção
npm run build

# Correr testes
npm test

# Verificar tipos TypeScript
npm run type-check

# Lint + format
npm run lint
npm run format
```

## Estrutura de Pastas

```
/
├── app/
│   ├── (dashboard)/    ← Layout e páginas do dashboard
│   │   ├── page.tsx    ← Home / Overview
│   │   ├── analytics/  ← Página de análise detalhada
│   │   └── settings/   ← Configurações de integrações
│   ├── api/
│   │   ├── auth/       ← Autenticação (OAuth)
│   │   ├── sync/       ← Endpoints de sincronização
│   │   ├── shopify/    ← Webhooks e dados Shopify
│   │   ├── google-ads/ ← Dados Google Ads
│   │   ├── meta-ads/   ← Dados Meta Ads
│   │   ├── tiktok-ads/ ← Dados TikTok Ads
│   │   └── dashboard/  ← Endpoints consolidados para dashboard
│   └── layout.tsx      ← Layout global
├── components/
│   ├── dashboard/      ← Componentes do dashboard
│   ├── charts/         ← Gráficos e visualizações
│   ├── ui/             ← Componentes UI reutilizáveis
│   └── integrations/   ← Setup de integrações
├── lib/
│   ├── api-clients/    ← Clientes para APIs externas
│   ├── db/             ← Queries/funções do Supabase
│   ├── utils/          ← Helpers, formatadores
│   └── constants/      ← Constantes do projeto
├── types/              ← Tipos TypeScript
├── public/             ← Arquivos estáticos
└── .env.local          ← Variáveis de ambiente (NÃO fazer commit!)
```

## Convenções de Código

- **TypeScript strict** — nunca usar `any`, ser explícito com tipos
- **Componentes React:** PascalCase (ex: `SalesChart.tsx`), sempre "use client" se usar hooks
- **Funções/utils:** camelCase (ex: `formatCurrency.ts`, `calculateROAS.ts`)
- **API routes:** prefixo específico (ex: `/api/sync/google-ads`, `/api/dashboard/kpis`)
- **Commits:** Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- **Sem código morto** — apagar código não utilizado, sem `console.log` em produção
- **Validação:** Sempre validar entrada de APIs externas com schemas (zod/yup)
- **Segurança:** 
  - Nunca logar credenciais, tokens ou dados sensíveis
  - Usar variáveis de ambiente para tudo sensível
  - Validar webhooks (assinatura de Shopify, etc.)
  - Rate limiting nas APIs internas

## Integrações Externas

| Serviço | Finalidade | Variável de Ambiente |
|---------|-----------|---------------------|
| **Shopify** | Pedidos, receita, clientes | `NEXT_PUBLIC_SHOPIFY_STORE_URL`, `SHOPIFY_API_TOKEN` |
| **Google Ads** | Gastos, impressões, cliques | `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET` |
| **Meta Ads** | Gastos, resultados por campanha | `META_ADS_ACCESS_TOKEN`, `META_ADS_ACCOUNT_ID` |
| **TikTok Ads** | Gastos, conversões, ROI | `TIKTOK_ADS_ACCESS_TOKEN`, `TIKTOK_ADS_BUSINESS_CENTRAL_ID` |
| **Supabase** | Database + Auth + Storage | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

## Variáveis de Ambiente

Todas as credenciais ficam no `.env.local` e `.env.local.example` (nunca fazer commit de credenciais):

```env
# Supabase (banco de dados + auth)
NEXT_PUBLIC_SUPABASE_URL=https://[projeto].supabase.co
SUPABASE_SERVICE_ROLE_KEY=...

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_URL=https://[loja].myshopify.com
SHOPIFY_API_TOKEN=...

# Google Ads (OAuth2)
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...

# Meta Ads
META_ADS_ACCESS_TOKEN=...
META_ADS_ACCOUNT_ID=...

# TikTok Ads
TIKTOK_ADS_ACCESS_TOKEN=...
TIKTOK_ADS_BUSINESS_CENTRAL_ID=...

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Restrições — O que o Claude NUNCA deve fazer

- ❌ Nunca hardcode secrets, tokens, IDs de conta ou credenciais no código
- ❌ Nunca expor tokens de API em logs, console ou respostas públicas
- ❌ Nunca apagar ficheiros sem confirmação explícita do utilizador
- ❌ Nunca fazer push sem correr `npm run build` e testes localmente
- ❌ Nunca fazer polling desnecessário a APIs (usar webhooks quando possível, cache de dados)
- ❌ Nunca confiar cegamente em dados de APIs externas — sempre validar e sanitizar
- ❌ Nunca alterar dados em Shopify/anúncios sem validação clara do utilizador (especialmente bids/budgets)
- ❌ Nunca esquecer de adicionar "use client" a componentes com hooks React (useState, useEffect, etc.)
- ❌ Nunca deixar dados sensíveis em localStorage — usar cookies secure/httpOnly quando necessário

## 📐 Documentação de Estrutura de Páginas

**Arquivo:** `STRUCTURE.md` (na raiz do projeto)

Este documento mapeia a estrutura, componentes e tipos de informação em cada página. **O Claude DEVE manter este arquivo sempre atualizado.**

### Quando Atualizar

- ✅ Ao adicionar uma nova página ou tab
- ✅ Ao modificar layout de uma página existente
- ✅ Ao adicionar novo componente reutilizável
- ✅ Ao mudar fluxo de dados ou tipos de informação

### O que Documentar

Para cada página documentar:
1. Arquivo (location)
2. Seções (ordem, tipo, conteúdo)
3. Componentes usados e props
4. Tipos de dados exibidos
5. Design system (cores, tipografia)
6. Responsividade
7. Fluxo de dados (API endpoints)

### Checklist

Antes de considerar uma mudança completa:
- [ ] Estrutura visual documentada
- [ ] Componentes listados com props
- [ ] Tipos de dados identificados
- [ ] STRUCTURE.md atualizado
- [ ] Histórico de mudanças anotado

## Padrões de Erro

*Esta secção documenta erros corrigidos durante o desenvolvimento para evitar repetição.*

Placeholder para futuras correções e aprendizados do projeto.
