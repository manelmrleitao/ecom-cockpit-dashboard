# 🎯 Getting Started - Ecom Cockpit Dashboard

Parabéns! Teu projeto **Ecom Cockpit Dashboard** está configurado e pronto para usar! 🚀

## ✅ O que foi configurado

### Infraestrutura Base
- ✅ Next.js 16 com Turbopack
- ✅ React 19 + TypeScript (strict mode)
- ✅ Tailwind CSS 4
- ✅ Estrutura de pastas profissional
- ✅ Build otimizado (13s)
- ✅ Type-checking 100% passando

### Componentes & Utilitários
- ✅ **KPICard** — Card reutilizável para métricas
- ✅ **PlatformPerformanceTable** — Tabela de comparação entre plataformas
- ✅ **kpi-calculator** — Funções para ROAS, CPA, AOV, CTR, etc.
- ✅ **validation-schemas** — Schemas Zod para validação

### Clientes de API
- ✅ **BaseClient** — Cliente HTTP genérico (GET, POST, PUT, DELETE)
- ✅ **ShopifyClient** — Integração com Shopify Store API
- ✅ **GoogleAdsClient** — Integração com Google Ads API
- ✅ **MetaAdsClient** — Integração com Meta Ads API
- ✅ **TikTokAdsClient** — Integração com TikTok Ads API

### Páginas
- ✅ Dashboard home com placeholders
- ✅ Layout com sidebar
- ✅ Design moderno com Tailwind CSS

## 🚀 Próximos Passos

### 1️⃣ Iniciar Servidor de Desenvolvimento

```bash
cd ecom-cockpit
npm run dev
```

Aceder a: **http://localhost:3000/dashboard**

### 2️⃣ Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Editar `.env.local` com tuas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_URL=https://[loja].myshopify.com
SHOPIFY_API_TOKEN=shppa_xxxxx

# Google Ads
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_CLIENT_ID=xxxxx
GOOGLE_ADS_CLIENT_SECRET=xxxxx
GOOGLE_ADS_REFRESH_TOKEN=xxxxx

# Meta Ads
META_ADS_ACCESS_TOKEN=xxxxx
META_ADS_ACCOUNT_ID=123456789

# TikTok Ads
TIKTOK_ADS_ACCESS_TOKEN=xxxxx
TIKTOK_ADS_BUSINESS_CENTRAL_ID=xxxxx
```

### 3️⃣ Setup Supabase

1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Copiar credenciais para `.env.local`
4. Correr SQL setup (ver [SETUP.md](SETUP.md#2-configurar-supabase))

### 4️⃣ Testar Sincronização

Quando tiveres as credenciais configuradas, podes testar os clientes:

```typescript
import { createShopifyClient } from '@/lib/api-clients'

const shopify = createShopifyClient()
const orders = await shopify.getOrders(new Date('2024-01-01'), new Date('2024-12-31'))
console.log(orders)
```

### 5️⃣ Construir Dashboard

Agora podes:
- Adicionar gráficos com Recharts
- Implementar queries com TanStack Query
- Adicionar autenticação com Supabase
- Criar API routes para sincronizar dados

## 📂 Estrutura do Projeto

```
ecom-cockpit/
├── app/
│   ├── (dashboard)/          # ← Dashboard pages
│   │   ├── page.tsx          # ← Home (customizar com dados reais)
│   │   └── layout.tsx        # ← Sidebar (functional)
│   └── api/                  # ← API routes (criar endpoints aqui)
├── components/
│   ├── dashboard/            # ← KPICard, PlatformPerformanceTable
│   └── charts/               # ← Adicionar gráficos aqui
├── lib/
│   ├── api-clients/          # ← Clientes já implementados
│   ├── constants/            # ← Constantes do projeto
│   ├── utils/                # ← Helpers, validação, KPI calcs
│   └── db/                   # ← Supabase config
├── types/                    # ← Tipos TypeScript
├── public/                   # ← Arquivos estáticos
├── .env.example              # ← Template de env
└── SETUP.md                  # ← Guia completo
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Type-check
npm run type-check

# Format código
npm run format

# Lint
npm run lint
```

## 📖 Documentação

- **[README.md](README.md)** — Overview do projeto
- **[SETUP.md](SETUP.md)** — Setup completo passo a passo
- **[CLAUDE.md](CLAUDE.md)** — Convenções, stack, restrições

## 💡 Dicas

1. **Componentes**: Usa o `KPICard` para métricas. É reutilizável e responsivo
2. **Validação**: Importa schemas de `@/lib/utils/validation-schemas` antes de processar dados de APIs
3. **Tipos**: Todos os tipos estão em `@/types/index.ts`. Adiciona novos tipos lá
4. **Utils**: Funções de cálculo (ROAS, CPA) estão em `kpi-calculator.ts`
5. **APIs**: Cada plataforma tem seu cliente em `lib/api-clients/`

## ❓ Dúvidas?

Tudo está documentado em [SETUP.md](SETUP.md). Se tiveres problemas:

1. Verifica `.env.local` tem as credenciais corretas
2. Verifica os erros no console (`npm run dev`)
3. Testa a conexão manualmente com os API clients

---

**Está pronto para começar! Boa sorte com teu dashboard! 🚀**
