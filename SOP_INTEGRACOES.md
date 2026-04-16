# 📋 SOP - Guia Rápido de Integrações por Plataforma

**Objetivo:** Instruções passo-a-passo para configurar cada plataforma de anúncios no Ecom Cockpit.

---

## 1️⃣ META ADS ✅ (Concluído)

### Requisitos
- Conta do Facebook Business Manager
- App criada no Meta for Developers

### Passos
1. Acede a [developers.facebook.com](https://developers.facebook.com)
2. Cria uma **Nova App** (tipo: Business)
3. Vai a **Customize use case** → **Create & manage ads with Marketing API**
4. Adiciona o **Ad Account ID** na secção "Ad Account"
   - Encontra em: [business.facebook.com](https://business.facebook.com) > Ad Accounts
5. Gera o **Access Token**:
   - Vai a [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Seleciona a tua App
   - Adiciona permissões: `ads_read` + `ads_management`
   - Clica **Generate Access Token**
6. Adiciona ao `.env.local`:
   ```env
   META_ADS_ACCOUNT_ID=769401137294776
   META_ADS_ACCESS_TOKEN=EAAL5t2X6...
   ```
7. Reinicia: `npm run dev`
8. Dashboard mostra aviso verde ✅

**Tempo:** ~15 minutos

---

## 2️⃣ GOOGLE ADS

### Requisitos
- Conta do Google Ads
- Google Cloud Project
- OAuth2 Client ID & Secret

### Passos
1. Acede a [Google Cloud Console](https://console.cloud.google.com)
2. Cria um **Novo Projeto**
3. **Ativa a API:**
   - Search "Google Ads API"
   - Clica **Enable**
4. **Cria OAuth2 Credentials:**
   - Vai a **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Escolhe **Desktop Application**
   - Guarda: `Client ID` e `Client Secret`
5. **Obtém o Refresh Token:**
   - Executa: `npm run dev`
   - Acede a: `http://localhost:3005/api/auth/google/callback` (vai gerar o URL)
   - Segue o fluxo OAuth
   - Copia o `refresh_token` da resposta
6. **Obtém o Customer ID:**
   - Em Google Ads → **Tools & Settings** → **Linked accounts**
   - Copia o ID (formato: XXX-XXX-XXXX)
7. **Obtém o Developer Token:**
   - Em Google Ads → **Tools & Settings** → **API Center**
   - Copia o Developer Token
8. Adiciona ao `.env.local`:
   ```env
   GOOGLE_ADS_CUSTOMER_ID=1234567890
   GOOGLE_ADS_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_ADS_CLIENT_SECRET=GOCSPX-xxx
   GOOGLE_ADS_REFRESH_TOKEN=1//0eXxxx
   GOOGLE_ADS_DEVELOPER_TOKEN=ca~xxx
   ```
9. Reinicia: `npm run dev`
10. Dashboard mostra aviso verde ✅

**Tempo:** ~20 minutos

**Docs:** [Google Ads API Setup](https://developers.google.com/google-ads/api/docs/start)

---

## 3️⃣ TIKTOK ADS

### Requisitos
- Conta do TikTok Ads Manager
- TikTok for Business Account

### Passos
1. Acede a [ads.tiktok.com](https://ads.tiktok.com)
2. Vai a **Settings** → **Assets** → **Developer**
3. Cria uma **Nova API App**
   - Nome: "Ecom Cockpit"
   - Seleciona: "Ads Management"
4. **Gera Access Token:**
   - Clica **Generate Token**
   - Autoriza com a tua conta TikTok
   - Copia o token (começa com `acd...`)
5. **Obtém o Business Central ID:**
   - Ads Manager → **Settings** → **Account**
   - Procura "Business Central ID"
6. Adiciona ao `.env.local`:
   ```env
   TIKTOK_ADS_ACCESS_TOKEN=acd...
   TIKTOK_ADS_BUSINESS_CENTRAL_ID=xxx
   ```
7. Reinicia: `npm run dev`
8. Dashboard mostra aviso verde ✅

**Tempo:** ~10 minutos

**Docs:** [TikTok Ads API](https://ads.tiktok.com/marketing_api/docs)

---

## 4️⃣ PINTEREST ADS

### Requisitos
- Conta do Pinterest Ads Manager
- Pinterest Business Account

### Passos
1. Acede a [business.pinterest.com](https://business.pinterest.com)
2. Vai a **Settings** → **Conversions** → **API**
3. Cria um **Novo Token:**
   - Clica **Generate Token**
   - Copia o token (começa com `v1...`)
4. **Obtém o Ad Account ID:**
   - Settings → **Account** → procura "Ad Account ID"
5. Adiciona ao `.env.local`:
   ```env
   PINTEREST_ADS_ACCESS_TOKEN=v1...
   PINTEREST_ADS_ACCOUNT_ID=xxx
   ```
6. Reinicia: `npm run dev`
7. Dashboard mostra aviso verde ✅

**Tempo:** ~10 minutos

**Docs:** [Pinterest Marketing API](https://developers.pinterest.com/docs/api/overview)

---

## 5️⃣ SHOPIFY

### Requisitos
- Loja Shopify ativa
- Admin API access

### Passos
1. Acede a **[Shopify Admin](https://admin.shopify.com)**
2. Vai a **Settings** → **Apps and integrations** → **Develop apps**
3. Clica **Create an app**
   - Nome: "Ecom Cockpit"
4. Na aba **Configuration**, ativa:
   - `read_orders`
   - `read_products`
   - `read_customers`
5. Clica **Install app**
6. **Copia as credenciais:**
   - Admin API access token → `SHOPIFY_API_TOKEN`
   - Store URL → `SHOPIFY_STORE_URL`
7. Adiciona ao `.env.local`:
   ```env
   SHOPIFY_STORE_URL=https://your-store.myshopify.com
   SHOPIFY_API_TOKEN=shpat_xxx
   ```
8. Reinicia: `npm run dev`
9. Dashboard mostra aviso verde ✅

**Tempo:** ~10 minutos

**Docs:** [Shopify Admin API](https://shopify.dev/docs/api/admin-rest)

---

## 🧪 Testar Todas as Integrações

### Via API (Terminal)
```bash
# Meta Ads
curl http://localhost:3005/api/meta-ads/metrics

# Google Ads
curl http://localhost:3005/api/google-ads/metrics

# TikTok Ads
curl http://localhost:3005/api/tiktok-ads/metrics

# Shopify
curl http://localhost:3005/api/shopify/metrics

# Dashboard KPIs (consolidado)
curl http://localhost:3005/api/dashboard/kpis
```

### Via Dashboard
1. Acede a `http://localhost:3005/dashboard`
2. Verifica os avisos:
   - 🟢 Verde = Plataforma funcionando
   - 🔴 Vermelho = Erro (mostra qual variável falta)
   - 🟡 Amarelo = Nenhuma plataforma configurada (demo)

---

## ⚠️ Troubleshooting Rápido

| Erro | Causa | Solução |
|------|-------|---------|
| "Missing environment variables" | Variáveis não adicionadas | Verifica `.env.local` e reinicia com `npm run dev` |
| "Invalid Access Token" | Token expirou | Gera um novo token (válido por 60 dias) |
| "Access Denied" | Permissões insuficientes | Verifica permissões na plataforma (ads_read, ads_management, etc) |
| "No campaign data" | Sem campanhas ativas | Cria uma campanha de teste na plataforma |
| "Rate limit exceeded" | Muitas requisições | Aguarda 1 minuto e tenta novamente |

---

## 🔄 Fluxo de Setup Recomendado

**Ordem sugerida (do mais rápido ao mais complexo):**

1. ✅ **Meta Ads** (15 min) - JÁ FEITO
2. **Shopify** (10 min)
3. **TikTok Ads** (10 min)
4. **Pinterest Ads** (10 min)
5. **Google Ads** (20 min) - Mais complexo

**Total:** ~65 minutos para todas as 5 plataformas

---

## 📝 Checklist de Verificação

Quando todas estão configuradas:

- [ ] Meta Ads - Aviso verde no dashboard
- [ ] Google Ads - Aviso verde no dashboard
- [ ] TikTok Ads - Aviso verde no dashboard
- [ ] Pinterest - Aviso verde no dashboard
- [ ] Shopify - Aviso verde no dashboard
- [ ] Endpoint `/api/dashboard/kpis` retorna dados de todas as plataformas
- [ ] Gráficos e tabelas preenchidos com dados reais

---

## 💡 Dicas

- **Refresh Tokens:** Alguns tokens expiram. Guarda os prompts para regenerá-los
- **Rate Limiting:** As APIs têm limites. Não faça queries muito frequentes
- **Testadores:** Em desenvolvimento, usa dados de teste/demo. Em produção, faz com dados reais
- **Sincronização:** O dashboard atualiza a cada mudança de período. Não é em tempo real

---

**Última atualização:** 2026-04-13
