# API Setup Guide

This guide walks you through setting up real data sources for the Ecom Cockpit dashboard.

## Quick Start

Run the interactive setup wizard:

```bash
npm run setup-apis
```

This will guide you through setting up:
- **Shopify** — Orders, revenue, customer data
- **Google Ads** — Campaign spend, conversions, ROI metrics
- **Meta Ads** — Campaign spend, conversions, performance data

### Available Commands

```bash
# Full setup wizard (all platforms)
npm run setup-apis

# Check current connection status
npm run setup-apis -- --verify

# Setup only specific platform
npm run setup-apis -- --shopify-only
npm run setup-apis -- --google-only
npm run setup-apis -- --meta-only
```

## What You'll Need

### Shopify Setup (5 minutes)

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels** → **Develop apps**
2. Create a new app (or use existing one)
3. Copy the **Admin API access token** (starts with `shpat_`)
4. Your store URL will be in format: `https://your-store.myshopify.com`

### Meta Ads Setup (10 minutes)

1. Go to **Meta Business Manager** → `https://business.facebook.com`
2. Click **Settings** → **Users and Assets** → **System Users**
3. Create or select a System User
4. Generate an **Access Token** (with `ads_management` scope)
5. Get your **Ad Account ID** (format: `act_1234567890`)

### Google Ads Setup (30 minutes)

You'll need 5 values from Google:

**1. Customer ID**
- Go to `ads.google.com`
- Click **Tools & Settings** → **Linked accounts**
- Copy your 10-digit Customer ID

**2. Developer Token**
- Go to `ads.google.com`
- Click **Tools & Settings** → **API Center**
- Copy the Developer Token (starts with `ca~`)

**3. OAuth Credentials** (from Google Cloud Console)
- Go to `console.cloud.google.com`
- Create a new project (or select existing)
- Enable "Google Ads API"
- Go to **APIs & Services** → **Credentials**
- Create **OAuth 2.0 Client ID** (type: Web application)
- Set redirect URI: `http://localhost:3000/api/auth/google/callback`
- Copy **Client ID** and **Client Secret**

**4. Refresh Token**
- This is obtained via OAuth flow
- The setup script will test your OAuth credentials
- If you need to get a refresh token manually:
  1. Replace `YOUR_CLIENT_ID` and run this URL in your browser:
     ```
     https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent
     ```
  2. Authorize access
  3. You'll be redirected to `localhost:3000/api/auth/google/callback?code=...`
  4. Use the `/api/auth/google/callback` route to exchange code for refresh token

## Running the Setup

```bash
npm run setup-apis
```

The script will:
1. Ask for your Shopify credentials
2. Test the Shopify connection
3. Ask for your Google Ads credentials
4. Test the Google Ads OAuth connection
5. Save everything to `.env.local`

## What Gets Saved

Your `.env.local` file will contain:

```env
# Shopify
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_API_TOKEN=shpat_xxxxx

# Google Ads
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_DEVELOPER_TOKEN=ca~xxxxx
GOOGLE_ADS_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_ADS_REFRESH_TOKEN=1//xxxxx

# Meta Ads
META_ADS_ACCESS_TOKEN=EAA...
META_ADS_ACCOUNT_ID=act_1234567890

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## After Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`

3. The dashboard will now display:
   - ✅ **Real Shopify data** — Orders, revenue, average order value
   - ✅ **Real Google Ads data** — Campaign spend, conversions, ROAS
   - 🔄 **Mock data for other platforms** — Meta Ads, TikTok Ads, Pinterest (placeholder)

4. Look for a **green banner** at the top indicating "Real data connected"

## Troubleshooting

### "Connection failed" for Shopify
- Check your API token starts with `shpat_`
- Verify the store URL format: `https://xxx.myshopify.com`
- Make sure the token hasn't expired in Shopify Admin

### "Google OAuth failed"
- Verify Client ID and Client Secret are correct (copy from Google Cloud Console)
- Check that the Refresh Token is valid (obtain via OAuth flow if needed)
- Ensure Google Ads API is enabled in your Google Cloud project

### "Meta Ads token invalid"
- Verify the Access Token is current (re-generate if needed from Business Manager)
- Check Account ID format: must start with `act_`
- Ensure System User has `ads_management` scope
- Token expires periodically, re-run setup to update

### Dashboard still shows mock data
- Run status check: `npm run setup-apis -- --verify`
- Check `.env.local` has all values filled
- Restart the dev server: `npm run dev`
- Check browser console for error messages

## Manual Re-Setup and Status Checks

### Check your current status anytime:
```bash
npm run setup-apis -- --verify
```

This will show which platforms are configured and which have missing credentials.

### Update only specific platforms:
```bash
# Re-setup only Shopify
npm run setup-apis -- --shopify-only

# Re-setup only Google Ads
npm run setup-apis -- --google-only

# Re-setup only Meta Ads
npm run setup-apis -- --meta-only
```

The script will ask if you want to keep existing values. You can update only the ones that changed.

## Security Notes

- **Never commit `.env.local`** — it's already in `.gitignore`
- Never share your API tokens or credentials
- For production, use environment variables from your hosting provider (Vercel, AWS, etc.)
- Regularly rotate your Google Ads Refresh Token if needed
