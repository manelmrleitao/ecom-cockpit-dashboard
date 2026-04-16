#!/usr/bin/env node

/**
 * Interactive API Setup Script
 * Guides you through setting up Shopify, Google Ads, and Meta Ads credentials
 * Validates formats and tests connections before saving
 *
 * Usage:
 *   npm run setup-apis                    # Full setup wizard
 *   npm run setup-apis -- --verify        # Check current status
 *   npm run setup-apis -- --shopify-only  # Setup only Shopify
 *   npm run setup-apis -- --google-only   # Setup only Google Ads
 *   npm run setup-apis -- --meta-only     # Setup only Meta Ads
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const ENV_FILE = path.join(process.cwd(), '.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️ ',
    success: '✅ ',
    error: '❌ ',
    warning: '⚠️  ',
    step: '📝 ',
    test: '🧪 ',
  };
  console.log(`\n${icons[type]} ${message}`);
}

function validateShopifyUrl(url) {
  if (!url.includes('myshopify.com')) {
    return { valid: false, error: 'Must be a Shopify URL (*.myshopify.com)' };
  }
  if (!url.startsWith('https://')) {
    return { valid: false, error: 'Must start with https://' };
  }
  return { valid: true };
}

function validateShopifyToken(token) {
  if (!token.startsWith('shpat_')) {
    return { valid: false, error: 'Token must start with shpat_' };
  }
  if (token.length < 30) {
    return { valid: false, error: 'Token seems too short (should be 30+ chars)' };
  }
  return { valid: true };
}

function validateGoogleAdsCustomerId(id) {
  const format = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
  if (!format.test(id.replace(/\s/g, ''))) {
    return { valid: false, error: 'Must be 10-digit number or XXX-XXX-XXXX format' };
  }
  return { valid: true };
}

function validateToken(token, name) {
  if (!token || token.length < 10) {
    return { valid: false, error: `${name} seems too short` };
  }
  return { valid: true };
}

async function testShopifyConnection(storeUrl, token) {
  log('Testing Shopify connection...', 'test');

  try {
    const response = await fetch(`${storeUrl}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log(`Connected to Shopify store: ${data.shop.name}`, 'success');
      return true;
    } else if (response.status === 401) {
      log('Authentication failed - check your API token', 'error');
      return false;
    } else {
      log(`Shopify returned: ${response.statusText}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Connection error: ${error.message}`, 'error');
    return false;
  }
}

async function testGoogleAdsConnection(clientId, clientSecret, refreshToken) {
  log('Testing Google Ads credentials format...', 'test');

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });

    if (response.ok) {
      log('Google Ads OAuth credentials are valid', 'success');
      return true;
    } else {
      const error = await response.json();
      log(`Google OAuth failed: ${error.error_description || error.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Connection error: ${error.message}`, 'error');
    return false;
  }
}

function loadExistingEnv() {
  if (fs.existsSync(ENV_FILE)) {
    const content = fs.readFileSync(ENV_FILE, 'utf-8');
    const env = {};
    content.split('\n').forEach((line) => {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2];
      }
    });
    return env;
  }
  return {};
}

function checkCurrentStatus() {
  const env = loadExistingEnv();

  console.clear();
  log('=== API Connection Status ===', 'step');

  // Shopify Status
  const shopifyUrl = env.SHOPIFY_STORE_URL;
  const shopifyToken = env.SHOPIFY_API_TOKEN;
  if (shopifyUrl && shopifyToken) {
    log(`Shopify: ✅ Configured (${shopifyUrl})`, 'success');
  } else {
    log('Shopify: ❌ Not configured', 'error');
  }

  // Google Ads Status
  const googleAdsReqs = [
    'GOOGLE_ADS_CUSTOMER_ID',
    'GOOGLE_ADS_DEVELOPER_TOKEN',
    'GOOGLE_ADS_CLIENT_ID',
    'GOOGLE_ADS_CLIENT_SECRET',
    'GOOGLE_ADS_REFRESH_TOKEN',
  ];
  const googleAdsConfigured = googleAdsReqs.every((key) => env[key]);
  if (googleAdsConfigured) {
    log(`Google Ads: ✅ Configured (${env.GOOGLE_ADS_CUSTOMER_ID})`, 'success');
  } else {
    const missing = googleAdsReqs.filter((key) => !env[key]);
    log(`Google Ads: ⚠️  Incomplete (missing: ${missing.join(', ')})`, 'warning');
  }

  // Meta Ads Status
  const metaToken = env.META_ADS_ACCESS_TOKEN;
  const metaAccountId = env.META_ADS_ACCOUNT_ID;
  if (metaToken && metaAccountId) {
    log(`Meta Ads: ✅ Configured (${metaAccountId})`, 'success');
  } else {
    log('Meta Ads: ❌ Not configured', 'error');
  }

  console.log('');
  log('To setup or update, run: npm run setup-apis', 'info');
  process.exit(0);
}

function saveEnv(env) {
  const lines = [
    '# ============================================================',
    '# ECOM COCKPIT - Environment Configuration',
    '# ============================================================',
    '',
    '# ============================================================',
    '# SHOPIFY CONFIGURATION',
    '# ============================================================',
    `SHOPIFY_STORE_URL=${env.SHOPIFY_STORE_URL || ''}`,
    `SHOPIFY_API_TOKEN=${env.SHOPIFY_API_TOKEN || ''}`,
    '',
    '# ============================================================',
    '# GOOGLE ADS CONFIGURATION',
    '# ============================================================',
    `GOOGLE_ADS_CUSTOMER_ID=${env.GOOGLE_ADS_CUSTOMER_ID || ''}`,
    `GOOGLE_ADS_DEVELOPER_TOKEN=${env.GOOGLE_ADS_DEVELOPER_TOKEN || ''}`,
    `GOOGLE_ADS_CLIENT_ID=${env.GOOGLE_ADS_CLIENT_ID || ''}`,
    `GOOGLE_ADS_CLIENT_SECRET=${env.GOOGLE_ADS_CLIENT_SECRET || ''}`,
    `GOOGLE_ADS_REFRESH_TOKEN=${env.GOOGLE_ADS_REFRESH_TOKEN || ''}`,
    '',
    '# ============================================================',
    '# META ADS CONFIGURATION',
    '# ============================================================',
    `META_ADS_ACCESS_TOKEN=${env.META_ADS_ACCESS_TOKEN || ''}`,
    `META_ADS_ACCOUNT_ID=${env.META_ADS_ACCOUNT_ID || ''}`,
    '',
    '# ============================================================',
    '# APPLICATION CONFIGURATION',
    '# ============================================================',
    `NEXT_PUBLIC_APP_URL=${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
    `NODE_ENV=${env.NODE_ENV || 'development'}`,
  ];

  fs.writeFileSync(ENV_FILE, lines.join('\n'));
  log(`Credentials saved to ${ENV_FILE}`, 'success');
}

async function setupShopify(existingEnv) {
  log('=== SHOPIFY SETUP ===', 'step');
  log('Get these from: Shopify Admin > Settings > Apps and sales channels > Develop apps', 'info');

  let storeUrl = existingEnv.SHOPIFY_STORE_URL || '';
  let token = existingEnv.SHOPIFY_API_TOKEN || '';

  // Store URL
  if (storeUrl) {
    const keep = await question(`Keep existing store URL? (${storeUrl}) [y/n]: `);
    if (keep.toLowerCase() !== 'y') {
      storeUrl = '';
    }
  }

  if (!storeUrl) {
    storeUrl = await question('Enter Shopify store URL (https://example.myshopify.com): ');
    const validation = validateShopifyUrl(storeUrl);
    if (!validation.valid) {
      log(validation.error, 'error');
      return setupShopify(existingEnv);
    }
  }

  // API Token
  if (token) {
    const keep = await question(`Keep existing API token? (${token.substring(0, 10)}...) [y/n]: `);
    if (keep.toLowerCase() !== 'y') {
      token = '';
    }
  }

  if (!token) {
    token = await question('Enter Shopify API token (shpat_...): ');
    const validation = validateShopifyToken(token);
    if (!validation.valid) {
      log(validation.error, 'error');
      return setupShopify(existingEnv);
    }
  }

  // Test connection
  const testOk = await testShopifyConnection(storeUrl, token);
  if (!testOk) {
    const retry = await question('Retry Shopify setup? [y/n]: ');
    if (retry.toLowerCase() === 'y') {
      return setupShopify({});
    }
  }

  return { SHOPIFY_STORE_URL: storeUrl, SHOPIFY_API_TOKEN: token };
}

async function setupGoogleAds(existingEnv) {
  log('=== GOOGLE ADS SETUP ===', 'step');
  log('Get these from: https://ads.google.com and Google Cloud Console', 'info');

  const customerId = existingEnv.GOOGLE_ADS_CUSTOMER_ID || '';
  if (customerId) {
    const keep = await question(`Keep existing Customer ID? (${customerId}) [y/n]: `);
    if (keep.toLowerCase() === 'y') {
      const developerToken = existingEnv.GOOGLE_ADS_DEVELOPER_TOKEN || '';
      const clientId = existingEnv.GOOGLE_ADS_CLIENT_ID || '';
      const clientSecret = existingEnv.GOOGLE_ADS_CLIENT_SECRET || '';
      const refreshToken = existingEnv.GOOGLE_ADS_REFRESH_TOKEN || '';

      if (developerToken && clientId && clientSecret && refreshToken) {
        log('All Google Ads credentials already configured', 'success');
        return {
          GOOGLE_ADS_CUSTOMER_ID: customerId,
          GOOGLE_ADS_DEVELOPER_TOKEN: developerToken,
          GOOGLE_ADS_CLIENT_ID: clientId,
          GOOGLE_ADS_CLIENT_SECRET: clientSecret,
          GOOGLE_ADS_REFRESH_TOKEN: refreshToken,
        };
      }
    }
  }

  const id = await question('Enter Google Ads Customer ID (10-digit): ');
  const validation = validateGoogleAdsCustomerId(id);
  if (!validation.valid) {
    log(validation.error, 'error');
    return setupGoogleAds({});
  }

  const devToken = await question('Enter Google Ads Developer Token: ');
  const devValidation = validateToken(devToken, 'Developer Token');
  if (!devValidation.valid) {
    log(devValidation.error, 'error');
    return setupGoogleAds({});
  }

  const clientId = await question(
    'Enter Google Cloud OAuth Client ID (xxx.apps.googleusercontent.com): '
  );
  const clientIdValidation = validateToken(clientId, 'Client ID');
  if (!clientIdValidation.valid) {
    log(clientIdValidation.error, 'error');
    return setupGoogleAds({});
  }

  const clientSecret = await question('Enter Google Cloud OAuth Client Secret: ');
  const secretValidation = validateToken(clientSecret, 'Client Secret');
  if (!secretValidation.valid) {
    log(secretValidation.error, 'error');
    return setupGoogleAds({});
  }

  const refreshToken = await question(
    'Enter Google Ads Refresh Token (obtain via OAuth flow or existing token): '
  );
  const refreshValidation = validateToken(refreshToken, 'Refresh Token');
  if (!refreshValidation.valid) {
    log(refreshValidation.error, 'error');
    return setupGoogleAds({});
  }

  // Test connection
  const testOk = await testGoogleAdsConnection(clientId, clientSecret, refreshToken);
  if (!testOk) {
    const retry = await question('Retry Google Ads setup? [y/n]: ');
    if (retry.toLowerCase() === 'y') {
      return setupGoogleAds({});
    }
    log(
      'Continuing without verification (you can test manually with: npm run dev)',
      'warning'
    );
  }

  return {
    GOOGLE_ADS_CUSTOMER_ID: id,
    GOOGLE_ADS_DEVELOPER_TOKEN: devToken,
    GOOGLE_ADS_CLIENT_ID: clientId,
    GOOGLE_ADS_CLIENT_SECRET: clientSecret,
    GOOGLE_ADS_REFRESH_TOKEN: refreshToken,
  };
}

async function setupMetaAds(existingEnv) {
  log('=== META ADS SETUP ===', 'step');
  log('Get these from: https://business.facebook.com/settings', 'info');

  const token = existingEnv.META_ADS_ACCESS_TOKEN || '';
  const accountId = existingEnv.META_ADS_ACCOUNT_ID || '';

  if (token && accountId) {
    const keep = await question(`Keep existing Meta account? (${accountId}) [y/n]: `);
    if (keep.toLowerCase() === 'y') {
      log('Meta Ads credentials already configured', 'success');
      return {
        META_ADS_ACCESS_TOKEN: token,
        META_ADS_ACCOUNT_ID: accountId,
      };
    }
  }

  const accessToken = await question('Enter Meta Ads Access Token (from Business Manager): ');
  const tokenValidation = validateToken(accessToken, 'Access Token');
  if (!tokenValidation.valid) {
    log(tokenValidation.error, 'error');
    return setupMetaAds({});
  }

  const adAccountId = await question('Enter Meta Ad Account ID (act_xxx): ');
  if (!adAccountId.startsWith('act_')) {
    log('Account ID must start with "act_"', 'error');
    return setupMetaAds({});
  }

  return {
    META_ADS_ACCESS_TOKEN: accessToken,
    META_ADS_ACCOUNT_ID: adAccountId,
  };
}

async function main() {
  const args = process.argv.slice(2);

  // Check for --verify flag
  if (args.includes('--verify')) {
    checkCurrentStatus();
    return;
  }

  console.clear();
  log('🚀 Ecom Cockpit - API Setup Wizard', 'step');
  log('Setting up connections for your dashboard', 'info');

  const existingEnv = loadExistingEnv();

  if (Object.keys(existingEnv).length > 0) {
    log(`Found existing .env.local with ${Object.keys(existingEnv).length} values`, 'info');
  }

  let finalEnv = {
    ...existingEnv,
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NODE_ENV: 'development',
  };

  // Determine which platforms to setup
  const setupShopifyFlag = !args.length || args.includes('--shopify-only') || args.includes('--full');
  const setupGoogleFlag = !args.length || args.includes('--google-only') || args.includes('--full');
  const setupMetaFlag = !args.length || args.includes('--meta-only') || args.includes('--full');

  if (setupShopifyFlag) {
    const shopifySetup = await setupShopify(existingEnv);
    finalEnv = { ...finalEnv, ...shopifySetup };
  }

  if (setupGoogleFlag) {
    const googleAdsSetup = await setupGoogleAds(existingEnv);
    finalEnv = { ...finalEnv, ...googleAdsSetup };
  }

  if (setupMetaFlag) {
    const metaSetup = await setupMetaAds(existingEnv);
    finalEnv = { ...finalEnv, ...metaSetup };
  }

  saveEnv(finalEnv);

  log('Setup complete! 🎉', 'success');
  log('Next steps:', 'info');
  console.log('  1. Run: npm run dev');
  console.log('  2. Visit: http://localhost:3000');
  console.log('  3. Check the dashboard for real data\n');
  console.log('To verify status anytime: npm run setup-apis -- --verify\n');

  rl.close();
}

main().catch((error) => {
  log(`Fatal error: ${error.message}`, 'error');
  rl.close();
  process.exit(1);
});
