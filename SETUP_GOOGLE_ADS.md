# 🔧 Google Ads Setup Guide

**Tempo estimado:** 20 minutos

---

## ✅ Pré-requisitos

- Conta Google Ads ativa com campanhas
- Acesso a Google Cloud Console

---

## 📋 Passos

### 1️⃣ Criar Projeto no Google Cloud Console

1. Acede a [Google Cloud Console](https://console.cloud.google.com)
2. Clica **Select a Project** (topo-esquerda)
3. Clica **NEW PROJECT**
4. Nome: "Ecom Cockpit"
5. Clica **CREATE**
6. Espera 1-2 minutos até o projeto estar criado

---

### 2️⃣ Ativar Google Ads API

1. No projeto novo, clica na barra de busca
2. Procura: **"Google Ads API"**
3. Clica no resultado
4. Clica **ENABLE**
5. Espera a ativação (vai demorar alguns segundos)

---

### 3️⃣ Gerar Client ID e Client Secret

1. No menu lateral, vai a **Credentials** (ou clica [aqui](https://console.cloud.google.com/apis/credentials))
2. Clica **+ CREATE CREDENTIALS**
3. Seleciona **OAuth 2.0 Client ID**
4. Se pedir, configura o OAuth Consent Screen primeiro:
   - Clica **CONFIGURE CONSENT SCREEN**
   - Seleciona **External**
   - Preenche: App name = "Ecom Cockpit"
   - Preenche: User support email = teu email
   - Clica **SAVE AND CONTINUE** até ao fim
5. Volta a **Credentials** → **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
6. Seleciona **Desktop application**
7. Clica **CREATE**
8. **Guarda:** `Client ID` e `Client Secret` (vais usar daqui a pouco)

---

### 4️⃣ Gerar Refresh Token

1. Abre terminal/bash no projeto
2. Inicia o servidor: `npm run dev`
3. Abre a URL: `http://localhost:3004/api/auth/google/callback` (vai estar em branco, é normal)
4. Abre uma nova aba do browser e vai a:

```
https://accounts.google.com/o/oauth2/v2/auth?
client_id=YOUR_CLIENT_ID_HERE
&redirect_uri=http://localhost:3004/api/auth/google/callback
&response_type=code
&scope=https://www.googleapis.com/auth/adwords
&access_type=offline
```

**Substitui `YOUR_CLIENT_ID_HERE` com o Client ID que guardaste em cima**

5. Autoriza a aplicação
6. Vai ser redireccionado para: `http://localhost:3004/api/auth/google/callback?code=XXX`
7. A página mostra um JSON com o `refresh_token` — **copia este valor**

---

### 5️⃣ Obter Customer ID

1. Acede a [Google Ads](https://ads.google.com)
2. No menu (hamburger ☰) → **Tools & Settings**
3. Clica **Linked accounts**
4. Procura o "Account ID" (formato: XXX-XXX-XXXX)
5. **Copia este valor**

---

### 6️⃣ Obter Developer Token

1. Em Google Ads → **Tools & Settings**
2. Clica **API Center**
3. Procura "Developer token" na secção **Create and manage apps**
4. **Copia este valor** (começa com `ca~`)

---

### 7️⃣ Adicionar ao `.env.local`

Abre `.env.local` e substitui os valores de placeholder:

```env
# Google Ads
GOOGLE_ADS_CUSTOMER_ID=123-456-7890
GOOGLE_ADS_CLIENT_ID=123456789-abc123...apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_ADS_REFRESH_TOKEN=1//0abc123...
GOOGLE_ADS_DEVELOPER_TOKEN=ca~abc123...
```

---

### 8️⃣ Testar Integração

1. Reinicia o servidor: `npm run dev`
2. Acede ao dashboard: `http://localhost:3004`
3. Verifica se o aviso de Google Ads fica 🟢 **verde**
4. Testa a API diretamente:
   ```bash
   curl http://localhost:3004/api/google-ads/metrics
   ```

---

## ✅ Pronto!

Google Ads deve estar funcionando no dashboard com dados reais.

Se houver erros, verifica:
- ✅ `GOOGLE_ADS_CUSTOMER_ID` no formato correto (XXX-XXX-XXXX)
- ✅ `GOOGLE_ADS_DEVELOPER_TOKEN` começa com `ca~`
- ✅ `GOOGLE_ADS_REFRESH_TOKEN` foi gerado corretamente (passo 4)
- ✅ Google Ads API ativada no Google Cloud Console
- ✅ OAuth Consent Screen configurado

**Próximo passo:** Voltar a Meta Ads e resolver o problema de token.
