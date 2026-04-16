# 🚀 Deploy com Mock Data

Guia para fazer deploy do Ecom Cockpit Dashboard com **dados fake** para demonstração.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com) (gratuito)
- Repositório no GitHub com o código

## 🎯 Passos

### 1. Preparar o Repositório

```bash
# Copia o ficheiro de exemplo
cp .env.local.example .env.local

# Verifica que está vazio (sem credenciais)
cat .env.local
```

O `.env.local` deve estar assim (vazio de credenciais):
```
NEXT_PUBLIC_SHOPIFY_STORE_URL=
SHOPIFY_API_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=
META_ADS_ACCESS_TOKEN=
# ... rest empty
```

### 2. Fazer Commit e Push

```bash
git add .
git commit -m "chore: prepare mock data deployment"
git push origin main
```

### 3. Deploy no Vercel

1. Vai a [vercel.com](https://vercel.com)
2. Clica em "New Project"
3. Seleciona o teu repositório GitHub
4. **Importante:** Em "Environment Variables"
   - **NÃO adiciones nenhuma credencial**
   - Deixa tudo vazio
   - Clica "Deploy"

5. **Pronto!** Vercel dá-te um link como:
   ```
   https://seu-dashboard.vercel.app
   ```

### 4. Partilhar o Link

Agora podes partilhar o link com:
- Clientes
- Colegas
- Investidores
- Amigos

Eles vão ver um **dashboard totalmente funcional com dados fake!**

---

## 📊 O que as Pessoas Veem (Mock Data)

O dashboard mostra automaticamente dados simulados:

### Shopify (Mock)
- **Receita:** €12,931.50
- **Pedidos:** 250
- **Clientes Únicos:** 180
- **Taxa de Retorno:** 15.2%

### Meta Ads (Mock)
- **Gasto:** €3,401.87
- **ROAS:** 4.57x
- **Conversões:** 348
- **CPA:** €9.78

### Fontes de Aquisição (Mock)
- Instagram, TikTok, Direct, Organic, Google, etc.
- Com receita, pedidos e AOV simulados

### Gráficos & Análises
- Todos os gráficos funcionam com dados fake
- Filtros de período funcionam normalmente
- Tabelas e comparações totalmente interativas

---

## 🔄 Atualizar o Deploy

Qualquer mudança que faças no código:

```bash
git add .
git commit -m "feat: seu descritivo"
git push origin main
```

Vercel faz **deploy automático** em ~2 minutos!

---

## 🎨 Customizar os Mock Data

Se quiseres mudar os valores mock, edita:

**Dashboard:**
- `components/dashboard/DashboardClient.tsx` - Linhas 60-150 (MOCK_DASHBOARD_DATA)

**Analytics:**
- `components/analytics/AnalyticsClient.tsx` - Linhas 240-350

**Shopify:**
- `app/api/shopify/metrics/route.ts` - MOCK_SHOPIFY_METRICS

---

## ⚠️ Importante: Segurança

Este setup é **apenas para demo/teste**:
- ✅ Seguro fazer deploy
- ✅ Sem credenciais reais
- ✅ Sem acesso a APIs reais
- ⚠️ Quando quiseres dados reais, adiciona credenciais no Vercel

---

## 🚀 Link de Exemplo Pronto

Quando fizers deploy, terás algo como:

```
🌐 https://seu-ecom-dashboard.vercel.app
```

**Partilha este link** e as pessoas podem:
- ✅ Ver o dashboard funcionar
- ✅ Testar todos os filtros
- ✅ Explorar os gráficos
- ✅ Ver análises e insights
- ✅ Tudo sem credenciais!

---

## 💡 Dicas

1. **Título Customizado** - Muda "Ecom Cockpit" para o nome da tua empresa
2. **Logo** - Substitui o logo em `public/favicon.ico`
3. **Cores** - Customiza tema em `tailwind.config.ts`
4. **Dados** - Muda valores mock se precisar de algo mais realista

---

## 📞 Suporte

Se tiver problemas:

1. Verifica os logs do Vercel (Dashboard → Deployments → Logs)
2. Confirma que `.env.local` está vazio
3. Tenta `npm run build` localmente

Boa sorte! 🎉
