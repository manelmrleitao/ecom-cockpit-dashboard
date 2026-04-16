# Setup Meta Ads - Guia Completo

## Resumo

Para integrar Meta Ads com o Ecom Cockpit, precisa de:
1. **Criar uma App no Meta** (Facebook Developers)
2. **Obter o Access Token** (permissões ads específicas)
3. **Configurar as variáveis de ambiente**
4. **Testar a integração**

---

## Passo 1: Acessar Meta for Developers

1. Aceda a [developers.facebook.com](https://developers.facebook.com)
2. Faça login com a sua conta de **Business Manager** (não é a conta pessoal)
3. Se não tiver uma conta de Business Manager:
   - Aceda a [business.facebook.com](https://business.facebook.com)
   - Crie uma conta nova

---

## Passo 2: Criar uma Nova App

1. No painel de developers, clique em **"Meus Apps"** (My Apps)
2. Clique em **"Criar App"** (Create App)
3. Escolha **"Negócio"** (Business) como tipo
4. Preencha os detalhes:
   - **Nome da App:** `Ecom Cockpit` (ou o que preferir)
   - **Email de contato:** seu email profissional
   - **Propósito:** Selecione "Anúncios" (Ads)
5. Clique em **"Criar App"**

---

## Passo 3: Adicionar o Produto "Marketing API"

1. Na página da sua App, vá a **Produtos** (Products)
2. Procure por **"Marketing API"**
3. Clique em **"Adicionar"** (Add)
4. Confirme a adição

---

## Passo 4: Configurar Permissões

1. Na barra esquerda, vá a **Definições** → **Permissões Básicas** (Settings → Basic Settings)
2. Procure pela secção de **"Roles da App"** (App Roles) / **"Dados de Teste"**

Para ter acesso aos dados reais de anúncios:
1. Vá a **Funções e Acesso** (Roles and Access) → **Testes** (Testing)
2. **Adicione um Testador** (Add Tester) com a sua conta pessoal

---

## Passo 5: Gerar o Access Token

### Opção A: Token de Duração Longa (Recomendado para Desenvolvimento)

1. Na barra esquerda, vá a **Definições** → **Básico** (Settings → Basic)
2. Procure por **"Token da App"** (App Token)
3. Copie o valor (começa com `EAA...`)
4. **NOTA:** Este token é para a App, não para a User API

### Opção B: User Access Token (Recomendado para Produção)

1. Aceda a [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecione a sua App no dropdown no topo
3. Mude de **"Get"** para **"Post"**
4. Na barra de consulta, escreva:
   ```
   /v18.0/oauth/access_token
   ```
5. Nos parâmetros, adicione:
   - `grant_type`: `client_credentials`
   - `client_id`: (seu App ID)
   - `client_secret`: (seu App Secret)
   - `fields`: `access_token,token_type`
6. Clique em **Submit**
7. Copie o `access_token` da resposta

**Melhor Abordagem:** Use um **Token de Utilizador de Longa Duração**
1. Vá a [Configurações → Permissões Básicas](https://developers.facebook.com/docs/permissions)
2. Gere um token pessoal com:
   - `ads_read`
   - `ads_management`
   - `business_management`

---

## Passo 6: Obter o Account ID

O Account ID é necessário para aceder aos dados de anúncios.

### Opção A: Via Business Manager

1. Aceda a [business.facebook.com](https://business.facebook.com)
2. Na barra esquerda, vá a **Contas de Anúncios** (Ad Accounts)
3. Clique na sua Conta de Anúncios
4. Na URL, veja o ID:
   ```
   business.facebook.com/settings/?business_id=<BUSINESS_ID>&asset_id=<ACCOUNT_ID>
   ```
5. O `ACCOUNT_ID` é o que precisa (sem o prefixo `act_`)

### Opção B: Via Graph API Explorer

```
GET /v18.0/me/adaccounts
```

Resposta:
```json
{
  "data": [
    {
      "id": "act_123456789",
      "name": "Minha Conta"
    }
  ]
}
```

Use o ID sem o `act_` (neste caso: `123456789`)

---

## Passo 7: Configurar Variáveis de Ambiente

Crie/atualize o arquivo `.env.local` com:

```env
# Meta Ads
META_ADS_ACCESS_TOKEN=EAA...seu_token_aqui
META_ADS_ACCOUNT_ID=123456789
```

**⚠️ IMPORTANTE:** Nunca commite o `.env.local` para o Git!

---

## Passo 8: Testar a Integração

### Via Terminal

```bash
# Reinicie o servidor
npm run dev
```

### Via API Direct

```bash
curl "http://localhost:3000/api/meta-ads/metrics?period=last30"
```

Resposta esperada (dados reais):
```json
{
  "campaigns": 5,
  "spend": 1200,
  "clicks": 425,
  "impressions": 18900,
  "conversions": 32,
  "conversionValue": 2400,
  "cpc": 2.82,
  "roas": 2.0,
  "currency": "USD",
  "isMock": false
}
```

### Via Dashboard

1. Aceda a `http://localhost:3000/dashboard`
2. Se configurado corretamente, deve ver um aviso verde:
   ```
   ✅ Integrações Ativas
   Meta Ads está configurado e funcionando.
   ```
3. Os dados de Meta Ads devem aparecer nas tabelas e gráficos

---

## Solução de Problemas

### Erro: "Missing environment variables"

```
Error: Meta Ads credentials not configured
Missing: META_ADS_ACCOUNT_ID, META_ADS_ACCESS_TOKEN
```

**Solução:** Adicione as variáveis no `.env.local` e reinicie o servidor.

### Erro: "Invalid Access Token"

```
Error: Meta API error: Invalid OAuth access token
```

**Causa:** O token expirou ou é inválido.

**Solução:**
1. Gere um novo token em [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Use um Token de Longa Duração (Long-Lived Token)
3. Verifique se as permissões incluem `ads_read` e `ads_management`

### Erro: "Campaign data access denied"

**Causa:** O token não tem permissões suficientes.

**Solução:**
1. Vá a [Facebook Business Manager](https://business.facebook.com)
2. Verifique se a conta de anúncios está no seu Business Manager
3. Verifique as permissões: **Definições** → **Utilizadores e Controlos**
4. Certifique-se de que a sua conta tem **Administrador** ou **Analisador** na conta de anúncios

### Dados aparecem como "isMock: true"

**Causa:** O backend não consegue conectar à API de Meta.

**Verificação:**
1. Abra o browser DevTools (F12)
2. Aceda a `/api/meta-ads/metrics` na Network tab
3. Procure pela mensagem de erro exata
4. Siga as soluções acima

---

## Segurança - Boas Práticas

1. ✅ **Nunca** coloque tokens no código
2. ✅ **Sempre** use `.env.local` para credenciais
3. ✅ **Sempre** use tokens de Longa Duração em produção
4. ✅ **Rotação:** Regenere tokens a cada 3-6 meses
5. ✅ **Logging:** Nunca log tokens em logs/console (está a ser feito)

---

## Documentação Oficial

- [Meta for Developers - Getting Started](https://developers.facebook.com/docs/marketing-api/getting-started)
- [Marketing API - Ad Accounts](https://developers.facebook.com/docs/marketing-api/reference/ad-account)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens)

---

## Próximos Passos

Depois de configurar Meta Ads:
1. ✅ Configure **Google Ads** (se ainda não estiver)
2. ✅ Configure **TikTok Ads** (opcional)
3. ✅ Configure **Pinterest** (opcional)
4. ✅ Teste o endpoint consolidado `/api/dashboard/kpis`
