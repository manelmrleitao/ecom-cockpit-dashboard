# 🚀 Setup Ecom Cockpit Dashboard

Guia passo a passo para configurar e executar o projeto.

## Requisitos

- Node.js 18+ e npm
- Conta Supabase
- Conta Shopify (com API access)
- Conta Google Ads (com API access)
- Conta Meta Ads (com API access)
- Conta TikTok Ads (com API access)

## 1. Instalação de Dependências

```bash
npm install
```

## 2. Configurar Supabase

### 2.1 Criar Projeto Supabase

1. Aceder a [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Copiar URL e Anon Key das configurações

### 2.2 Crear Tabelas

No Supabase SQL Editor, correr:

```sql
-- Tabela de métricas de anúncios
CREATE TABLE ad_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(20) NOT NULL,
  campaign_name VARCHAR(255) NOT NULL,
  impressions INTEGER NOT NULL,
  clicks INTEGER NOT NULL,
  spend DECIMAL(10, 2) NOT NULL,
  conversions INTEGER NOT NULL,
  revenue DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, campaign_name, date)
);

-- Tabela de pedidos Shopify
CREATE TABLE shopify_orders (
  id TEXT PRIMARY KEY,
  total_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  synced_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de integrações (guardar credenciais encriptadas)
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  credentials JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform)
);
```

## 3. Configurar Variáveis de Ambiente

Copiar `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Editar `.env.local` com as credenciais:

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
GOOGLE_ADS_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=xxxxx
GOOGLE_ADS_REFRESH_TOKEN=xxxxx

# Meta Ads
META_ADS_ACCESS_TOKEN=xxxxx
META_ADS_ACCOUNT_ID=123456789

# TikTok Ads
TIKTOK_ADS_ACCESS_TOKEN=xxxxx
TIKTOK_ADS_BUSINESS_CENTRAL_ID=xxxxx
```

## 4. Integração com Shopify

### 4.1 Criar App Privado no Shopify

1. Ir a Settings → Apps and integrations
2. Develop apps → Create an app
3. Nome: "Ecom Cockpit"
4. Dar acesso a:
   - read_orders
   - read_customers
5. Copiar API token gerado

### 4.2 Webhooks

Para sincronização em tempo real:

```bash
POST /api/webhooks/shopify
Topic: orders/create, orders/update
```

## 5. Integração com APIs de Publicidade

### Google Ads

1. Google Cloud Console → criar credenciais OAuth 2.0
2. Scopes: `https://www.googleapis.com/auth/adwords`
3. Copiar Client ID e Client Secret

### Meta Ads

1. Meta Business Platform → criar App
2. Ir a Settings → API
3. Gerar Access Token com scopes: `ads_management`

### TikTok Ads

1. TikTok Ads Manager → Business Account
2. Account Settings → API
3. Copiar Access Token

## 6. Rodar em Desenvolvimento

```bash
npm run dev
```

Abrir [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 7. Build de Produção

```bash
npm run build
npm start
```

## Troubleshooting

### "Module not found" errors

```bash
rm -rf .next node_modules
npm install
```

### Supabase connection errors

- Verificar `.env.local` com credenciais corretas
- Verificar firewall/VPN
- Testar conexão via Supabase Studio

### APIs não sincronizam

- Verificar credenciais em `.env.local`
- Verificar rate limits das APIs
- Ver logs: `npm run dev` e abrir navegador

## Próximos Passos

- [ ] Setup Supabase e criar tabelas
- [ ] Configurar variáveis de ambiente
- [ ] Testar sincronização de Shopify
- [ ] Adicionar gráficos ao dashboard
- [ ] Deploy em Vercel

---

**Documentação**: Ver [README.md](README.md) e [CLAUDE.md](CLAUDE.md)
