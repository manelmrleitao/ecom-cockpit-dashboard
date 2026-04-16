async function test() {
  try {
    console.log('Testing Meta Ads Metrics...');
    const metaRes = await fetch('http://localhost:3000/api/meta-ads/metrics?period=today');
    const metaData = await metaRes.json();

    console.log('\n=== Meta Ads - TODAY ===');
    console.log(JSON.stringify(metaData, null, 2));

    console.log('\n\nTesting Shopify Today...');
    const shopifyRes = await fetch('http://localhost:3000/api/shopify/metrics?period=today');
    const shopifyData = await shopifyRes.json();

    console.log('\n=== Shopify - TODAY ===');
    console.log(JSON.stringify(shopifyData, null, 2));

    console.log('\n\nTesting Shopify Last 7 Days...');
    const shopify7Res = await fetch('http://localhost:3000/api/shopify/metrics?period=last7');
    const shopify7Data = await shopify7Res.json();

    console.log('\n=== Shopify - LAST 7 DAYS ===');
    console.log(JSON.stringify(shopify7Data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

test();
