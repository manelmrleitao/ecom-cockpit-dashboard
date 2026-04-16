# Scripts Directory

## setup-apis.js

Interactive API setup wizard for configuring external data sources.

### Features

✅ **Interactive prompts** — Easy step-by-step configuration
✅ **Validation** — Format checking for all credentials
✅ **Connection testing** — Verify credentials work before saving
✅ **Status checking** — See which platforms are configured
✅ **Selective setup** — Configure only the platforms you need
✅ **Existing credential management** — Update only what changed

### Usage

```bash
# Full setup wizard
npm run setup-apis

# Check status of all connections
npm run setup-apis -- --verify

# Setup specific platforms
npm run setup-apis -- --shopify-only
npm run setup-apis -- --google-only
npm run setup-apis -- --meta-only
```

### Supported Platforms

1. **Shopify** — E-commerce orders, revenue, customer data
2. **Google Ads** — Campaign metrics, spend, conversions
3. **Meta Ads** — Facebook/Instagram campaign data

### How It Works

1. **Load existing env** — Reads current `.env.local` if it exists
2. **Prompt for credentials** — Interactive questions with validation
3. **Test connections** — Verifies credentials with actual API calls
4. **Save to .env.local** — Stores configuration securely

### Output

Updates `.env.local` with:
```env
SHOPIFY_STORE_URL=...
SHOPIFY_API_TOKEN=...
GOOGLE_ADS_CUSTOMER_ID=...
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
META_ADS_ACCESS_TOKEN=...
META_ADS_ACCOUNT_ID=...
```

### Documentation

See [SETUP_APIS_GUIDE.md](../SETUP_APIS_GUIDE.md) for detailed step-by-step instructions for each platform.
