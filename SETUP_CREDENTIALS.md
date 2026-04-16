# 🔐 Setup de Credenciais - Ecom Cockpit

Este guia ajuda a configurar as integrações com Shopify e Google Ads para habilitar dados reais no dashboard.

## ⚡ Resumo

- **Shopify Setup:** ~5 minutos
- **Google Ads Setup:** ~30 minutos
- **Total:** ~35 minutos, one-time only

---

## 1️⃣ Shopify (5 minutos)

### Passo 1: Criar App no Shopify Admin

1. Acede ao **Shopify Admin** → `Settings` → `Apps and sales channels` → `Develop apps`
2. Clica em **"Create an app"**
3. Dá um nome (ex: "Ecom Cockpit Dashboard")
4. Clica **"Create app"**

### Passo 2: Configurar Scopes

1. Vai para `Configuration` na app que criaste
2. Em **Admin API scopes**, marca estas permissões:
   - `read_orders` (para dados de pedidos)
   - `read_customers` (para dados de clientes)
   - `read_products` (opcional, para análise de produtos)
3. Clica **"Save"**

### Passo 3: Gerar Token

1. Volta ao topo da página
2. Em **Admin API access tokens**, clica **"Install app"**
3. **Copia o token** que começa com `shpat_` (exemplo: `shpat_a1b2c3d4...`)

### Passo 4: Adicionar ao .env.local

Cria um ficheiro `.env.local` na raiz do projeto:

```env
SHOPIFY_STORE_URL=https://[seu-store-name].myshopify.com
SHOPIFY_API_TOKEN=shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Nota:** Substitui `[seu-store-name]` pelo nome real da tua loja.

✅ Shopify está configurado! Os dados devem aparecer no dashboard.

---

## 2️⃣ Google Ads (30 minutos)

### Passo 1: Developer Token

1. Acede a **[Google Ads](https://ads.google.com)**
2. Clica no ícone de engrenagem ⚙️ → `Tools & Settings`
3. Em **Setup**, clica **`API Center`**
4. **Copia o Developer Token** (exemplo: `ca~e1b2c3d4e5f6g7h8`)
5. Adiciona ao `.env.local`:

```env
GOOGLE_ADS_DEVELOPER_TOKEN=ca~e1b2c3d4e5f6g7h8
GOOGLE_ADS_CUSTOMER_ID=1234567890
```

**Nota:** Encontra o Customer ID no Google Ads Admin (formato: 10 dígitos com hífen)

### Passo 2: OAuth Client (Google Cloud Console)

1. Acede a **[Google Cloud Console](https://console.cloud.google.com)**
2. Cria um **novo projeto** (ou usa um existente)
3. Ativa a **Google Ads API**:
   - `APIs & Services` → `+ Enable APIs and Services`
   - Procura "Google Ads API"
   - Clica **"Enable"**

### Passo 3: OAuth Credentials

1. Em `APIs & Services`, clica **`Credentials`** (à esquerda)
2. Clica **`+ Create Credentials`** → **`OAuth 2.0 Client ID`**
3. Seleciona **Application type:** `Web application`
4. Em **Authorized redirect URIs**, adiciona:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
5. Clica **"Create"**
6. **Copia Client ID e Client Secret**:

```env
GOOGLE_ADS_CLIENT_ID=123456789-abc1def2ghi3jkl4mno5pqr6stu7vwx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-abcDeFgHiJkLmNoPqRstUvw
```

### Passo 4: Obter Refresh Token (ONE-TIME)

Este é um processo interativo one-time para obter o refresh token:

1. **Com o servidor running** (`npm run dev`), abre este URL no browser (substitui `[CLIENT_ID]`):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=[CLIENT_ID]&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent
```

**Exemplo completo:**
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=123456789-abc1def2ghi3.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent
```

2. Login com a **conta Google Ads** que tem acesso ao account
3. Autoriza o acesso
4. Serás redirecionado para `http://localhost:3000/api/auth/google/callback?code=...`
5. A página mostra o `refresh_token` — **copia-o!**

### Passo 5: Adicionar Refresh Token

Adiciona ao `.env.local`:

```env
GOOGLE_ADS_REFRESH_TOKEN=1//0gYLX2OI7S8-lCgYIARAAGBASNwF-L9IrEzVaBcDeFgHiJkLmNoPqRstUvwxyz123
```

### Passo 6: Restart

1. **Pára o servidor** (`Ctrl+C` no terminal)
2. **Reinicia** (`npm run dev`)
3. Testa acedendo ao dashboard — dados Google Ads devem aparecer! 🎉

---

## ✅ Verificação Final

Depois de configurar, o dashboard deve mostrar:

| Fonte | Status | Dados |
|-------|--------|-------|
| Shopify | Verde ✅ | Pedidos, receita, clientes |
| Google Ads | Azul ℹ️ | Gastos, cliques, impressões, conversões |
| Ambos | Verde ✅ | ROAS, CPC, AOV, etc |

Se algo estiver em **amarelo** ⚠️ (mock data), revisa a configuração acima.

---

## 🆘 Troubleshooting

### "Missing Google OAuth credentials"
- Verifica se todas as 5 variáveis estão no `.env.local`
- Reinicia o servidor após adicionar

### "Token exchange failed"
- Verifica o `GOOGLE_ADS_CLIENT_ID` e `CLIENT_SECRET`
- Certifica-te que o redirect URI em Google Cloud é exactamente:
  ```
  http://localhost:3000/api/auth/google/callback
  ```

### "Google Ads API error"
- Confirma que o Developer Token está activado
- Aguarda 24h se recém-criado (às vezes demora)

### Dados aparecem como "mock"
- Significa que as credenciais não estão configuradas corretamente
- Revê os passos 1 e 2

---

## 🔒 Segurança

- **NUNCA** commits o `.env.local` para Git
- **NUNCA** expõe os tokens em logs ou respostas públicas
- Os tokens são guardados apenas em `.env.local` (server-side)
- Use refresh tokens, nunca hardcode access tokens

---

## 📞 Próximos Passos

Depois de configurar:

1. Dashboard mostra dados reais 📊
2. Configure alertas e relatórios automáticos
3. Integre Meta Ads, TikTok Ads, Pinterest Ads
4. Configure webhooks do Shopify para sync em real-time

Qualquer dúvida, revê a [Documentação do Projeto](/CLAUDE.md).
