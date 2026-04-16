# 🔐 Setup de Credenciais - Ecom Cockpit

## Passo 1️⃣: Shopify

### 1. Encontrar o Store URL
- Vá a **Shopify Admin**
- O URL é visível na barra de endereço: `https://[sua-loja].myshopify.com`

### 2. Obter Client ID e Client Secret
1. **Shopify Dev Dashboard** → **Apps** → **Develop apps** → **Cockpit Dashboard** (ou crie se não existir)
2. Se não existir, clique em **"Create an app"**
   - Nome: "Cockpit Dashboard"
   - Admin API scopes: Ative `read_orders`
3. Clique em **"Install app"** (se ainda não instalada)
4. Vá para **"Definições"** → **"Credenciais"**
5. Copie:
   - **ID de cliente** → `SHOPIFY_CLIENT_ID`
   - **Chave secreta** (que começa com `shpss_`) → `SHOPIFY_CLIENT_SECRET`

**Nota:** O access token é gerado automaticamente no servidor usando estas credenciais (OAuth Client Credentials Grant). Não precisa de procurar um token `shpat_` manualmente.

---

## Passo 2️⃣: Google Ads

### 1. Developer Token (5 min)
1. Vá a **https://ads.google.com**
2. **Tools & Settings** → **API Center**
3. Copie o **Developer Token**
   - Formato: `xxxxxxxxxxxxxxxxxxxxx`

### 2. OAuth Client (10 min)
1. Vá a **https://console.cloud.google.com**
2. Crie um novo projeto (nome: "Cockpit")
3. **APIs & Services** → **Enable APIs**
   - Procure e ative **"Google Ads API"**
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Type: **Web application**
   - Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
5. Copie:
   - **Client ID** (formato: `xxxx.apps.googleusercontent.com`)
   - **Client Secret** (formato: `GOCSPX-xxx`)

### 3. Customer ID
1. Volte a **https://ads.google.com**
2. Procure o **Customer ID** (formato: `123-456-7890` ou `1234567890`)
3. Se tiver hífens, **remova-os** para a variável de ambiente

### 4. Refresh Token (5 min - processo único)
1. Abra este URL no navegador (substitua CLIENT_ID):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=SEU_CLIENT_ID&redirect_uri=http://localhost:3001/api/auth/google/callback&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent
```

2. Autorize com a conta Google Ads
3. Será redirecionado para `localhost:3001/api/auth/google/callback?code=xxx`
4. Copie o `refresh_token` da resposta JSON

---

## Passo 3️⃣: Ficheiro `.env.local`

Crie um ficheiro chamado `.env.local` na raiz do projeto com este conteúdo:

```env
# Shopify
SHOPIFY_STORE_URL=https://[sua-loja].myshopify.com
SHOPIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_CLIENT_SECRET=shpss_xxxxxxxxxxxxxxxxxxxxxxxx

# Google Ads (OAuth2)
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_DEVELOPER_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_ADS_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_ADS_REFRESH_TOKEN=1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

---

## ✅ Verificação

Depois de preencher as credenciais:

1. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

2. **Aceda ao dashboard**:
   - http://localhost:3001/dashboard

3. **Verifique se há dados reais**:
   - Se as credenciais estão corretas, deixará de ver o aviso "⚠️ A usar dados de demonstração"
   - Os KPIs mostrarão dados reais do Shopify e Google Ads

---

## 🆘 Troubleshooting

### "Aviso: A usar dados de demonstração" continua a aparecer
- Verifique se o ficheiro `.env.local` existe
- Reinicie o servidor (`npm run dev`)
- Verifique no terminal se as variáveis de ambiente foram carregadas

### Erro 401/403 no Google Ads
- Verifique se o **Developer Token** está correto
- Verifique se a conta Google Ads está ativa e aprovada
- Tente regenerar o **Refresh Token**

### Erro de autenticação no Shopify
- Verifique o **Store URL**, **Client ID** e **Client Secret**
- Garanta que o scope `read_orders` está ativado no token
- Verifique se a app foi instalada correctamente
- Tente regenerar as credenciais na app

---

## 📝 Notas

- **Nunca faça commit** do ficheiro `.env.local` (está no `.gitignore`)
- As credenciais são apenas para uso local
- Cada developer pode ter o seu próprio `.env.local`
