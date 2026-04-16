async function test() {
  try {
    console.log('Testing Meta Ads Campaigns...');
    const res = await fetch('http://localhost:3000/api/meta-ads/campaigns?period=today');
    const data = await res.json();

    if (data.campaigns && data.campaigns.length > 0) {
      // Find campaign with highest spend
      const topCampaign = data.campaigns.reduce((prev, current) =>
        (prev.spend > current.spend) ? prev : current
      );

      console.log('\n=== TOP CAMPAIGN (Highest Spend Today) ===');
      console.log(`Name: ${topCampaign.name}`);
      console.log(`Spend: $${topCampaign.spend} (€${(topCampaign.spend * 0.92).toFixed(2)})`);
      console.log(`CTR: ${topCampaign.ctr}%`);
      console.log(`CPA: $${topCampaign.cpa} (€${(topCampaign.cpa * 0.92).toFixed(2)})`);
      console.log(`ROAS: ${topCampaign.roas}x`);

      console.log('\n=== All Campaigns Today ===');
      data.campaigns.forEach(c => {
        console.log(`${c.name}: $${c.spend} | CTR: ${c.ctr}% | ROAS: ${c.roas}x`);
      });
    } else {
      console.log('No campaigns data:', data);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
