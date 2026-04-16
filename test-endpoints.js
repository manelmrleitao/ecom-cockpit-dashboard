// Test script for Meta Ads and Shopify endpoints
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 15000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function test() {
  try {
    console.log('=== Testing Meta Ads Campaigns (Today) ===');
    const metaCampaigns = await makeRequest('/api/meta-ads/campaigns?period=today');
    console.log(JSON.stringify(metaCampaigns, null, 2));

    if (metaCampaigns.campaigns && metaCampaigns.campaigns.length > 0) {
      // Find campaign with highest spend
      const topCampaign = metaCampaigns.campaigns.reduce((prev, current) =>
        (prev.spend > current.spend) ? prev : current
      );

      console.log('\n=== TOP CAMPAIGN (Highest Spend) ===');
      console.log(`Name: ${topCampaign.name}`);
      console.log(`Spend: €${(topCampaign.spend * 0.92).toFixed(2)}`);
      console.log(`CTR: ${topCampaign.ctr}%`);
      console.log(`CPA: €${(topCampaign.cpa * 0.92).toFixed(2)}`);
      console.log(`ROAS: ${topCampaign.roas}x`);
    }

    console.log('\n=== Testing Shopify Metrics (Today) ===');
    const shopifyToday = await makeRequest('/api/shopify/metrics?period=today');
    console.log(JSON.stringify(shopifyToday, null, 2));

    console.log('\n=== Testing Shopify Metrics (Last 7 Days) ===');
    const shopify7d = await makeRequest('/api/shopify/metrics?period=last7');
    console.log(JSON.stringify(shopify7d, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
