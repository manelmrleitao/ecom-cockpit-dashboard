/**
 * Mock Data - 30 dias realistas
 * Dados simulados de Shopify, Meta Ads, Google Ads, TikTok
 * Atualizado: 2026-04-16
 */

export const MOCK_30_DAYS_DATA = {
  // Shopify - Daily data (últimos 30 dias)
  shopify: {
    daily: [
      { date: '2026-03-18', orders: 12, revenue: 384.50, customers: 11, returning: 1 },
      { date: '2026-03-19', orders: 18, revenue: 547.20, customers: 17, returning: 2 },
      { date: '2026-03-20', orders: 15, revenue: 489.75, customers: 14, returning: 1 },
      { date: '2026-03-21', orders: 22, revenue: 698.40, customers: 21, returning: 3 },
      { date: '2026-03-22', orders: 28, revenue: 856.80, customers: 26, returning: 5 },
      { date: '2026-03-23', orders: 32, revenue: 987.20, customers: 30, returning: 8 },
      { date: '2026-03-24', orders: 19, revenue: 612.30, customers: 18, returning: 2 },
      { date: '2026-03-25', orders: 24, revenue: 745.60, customers: 23, returning: 4 },
      { date: '2026-03-26', orders: 21, revenue: 687.30, customers: 20, returning: 3 },
      { date: '2026-03-27', orders: 25, revenue: 798.50, customers: 24, returning: 5 },
      { date: '2026-03-28', orders: 35, revenue: 1084.50, customers: 32, returning: 10 },
      { date: '2026-03-29', orders: 38, revenue: 1145.60, customers: 35, returning: 12 },
      { date: '2026-03-30', orders: 20, revenue: 645.00, customers: 19, returning: 3 },
      { date: '2026-03-31', orders: 23, revenue: 734.80, customers: 22, returning: 4 },
      { date: '2026-04-01', orders: 26, revenue: 826.40, customers: 25, returning: 6 },
      { date: '2026-04-02', orders: 29, revenue: 912.50, customers: 28, returning: 8 },
      { date: '2026-04-03', orders: 31, revenue: 987.20, customers: 30, returning: 9 },
      { date: '2026-04-04', orders: 18, revenue: 567.30, customers: 17, returning: 2 },
      { date: '2026-04-05', orders: 27, revenue: 856.80, customers: 26, returning: 7 },
      { date: '2026-04-06', orders: 34, revenue: 1078.40, customers: 32, returning: 11 },
      { date: '2026-04-07', orders: 39, revenue: 1223.70, customers: 37, returning: 14 },
      { date: '2026-04-08', orders: 22, revenue: 698.50, customers: 21, returning: 4 },
      { date: '2026-04-09', orders: 25, revenue: 789.30, customers: 24, returning: 6 },
      { date: '2026-04-10', orders: 28, revenue: 891.60, customers: 27, returning: 8 },
      { date: '2026-04-11', orders: 30, revenue: 954.00, customers: 29, returning: 9 },
      { date: '2026-04-12', orders: 36, revenue: 1143.60, customers: 34, returning: 12 },
      { date: '2026-04-13', orders: 41, revenue: 1289.50, customers: 39, returning: 15 },
      { date: '2026-04-14', orders: 24, revenue: 759.60, customers: 23, returning: 5 },
      { date: '2026-04-15', orders: 32, revenue: 1012.80, customers: 31, returning: 10 },
      { date: '2026-04-16', orders: 28, revenue: 886.40, customers: 27, returning: 7 },
    ],
    summary: {
      totalOrders: 828,
      totalRevenue: 26234.85,
      avgOrderValue: 31.68,
      uniqueCustomers: 789,
      returningCustomers: 210,
      returnRate: 26.6,
    },
  },

  // Meta Ads - Daily data
  metaAds: {
    daily: [
      { date: '2026-03-18', spend: 145.50, impressions: 42150, clicks: 1247, conversions: 28, conversionValue: 856.40 },
      { date: '2026-03-19', spend: 158.70, impressions: 48230, clicks: 1456, conversions: 35, conversionValue: 1089.50 },
      { date: '2026-03-20', spend: 142.30, impressions: 39840, clicks: 1123, conversions: 31, conversionValue: 978.60 },
      { date: '2026-03-21', spend: 176.50, impressions: 52410, clicks: 1678, conversions: 42, conversionValue: 1356.80 },
      { date: '2026-03-22', spend: 189.20, impressions: 56780, clicks: 1834, conversions: 48, conversionValue: 1567.20 },
      { date: '2026-03-23', spend: 201.40, impressions: 61230, clicks: 1956, conversions: 54, conversionValue: 1789.50 },
      { date: '2026-03-24', spend: 134.60, impressions: 35680, clicks: 1089, conversions: 26, conversionValue: 845.30 },
      { date: '2026-03-25', spend: 167.80, impressions: 48950, clicks: 1543, conversions: 39, conversionValue: 1234.50 },
      { date: '2026-03-26', spend: 156.20, impressions: 45120, clicks: 1432, conversions: 36, conversionValue: 1134.40 },
      { date: '2026-03-27', spend: 178.90, impressions: 52680, clicks: 1687, conversions: 43, conversionValue: 1398.70 },
      { date: '2026-03-28', spend: 198.50, impressions: 59840, clicks: 1923, conversions: 51, conversionValue: 1678.50 },
      { date: '2026-03-29', spend: 212.30, impressions: 64520, clicks: 2087, conversions: 57, conversionValue: 1945.80 },
      { date: '2026-03-30', spend: 145.70, impressions: 40230, clicks: 1234, conversions: 29, conversionValue: 876.50 },
      { date: '2026-03-31', spend: 167.40, impressions: 48970, clicks: 1567, conversions: 40, conversionValue: 1289.60 },
      { date: '2026-04-01', spend: 175.20, impressions: 51840, clicks: 1654, conversions: 44, conversionValue: 1456.80 },
      { date: '2026-04-02', spend: 189.80, impressions: 56230, clicks: 1789, conversions: 48, conversionValue: 1623.60 },
      { date: '2026-04-03', spend: 205.40, impressions: 60890, clicks: 1945, conversions: 53, conversionValue: 1834.90 },
      { date: '2026-04-04', spend: 138.90, impressions: 36450, clicks: 1123, conversions: 27, conversionValue: 876.30 },
      { date: '2026-04-05', spend: 176.30, impressions: 51620, clicks: 1678, conversions: 45, conversionValue: 1523.40 },
      { date: '2026-04-06', spend: 198.60, impressions: 58740, clicks: 1876, conversions: 51, conversionValue: 1734.50 },
      { date: '2026-04-07', spend: 214.20, impressions: 63840, clicks: 2043, conversions: 58, conversionValue: 1987.60 },
      { date: '2026-04-08', spend: 152.30, impressions: 43210, clicks: 1345, conversions: 32, conversionValue: 1034.60 },
      { date: '2026-04-09', spend: 168.70, impressions: 49560, clicks: 1578, conversions: 41, conversionValue: 1367.80 },
      { date: '2026-04-10', spend: 181.40, impressions: 53240, clicks: 1698, conversions: 46, conversionValue: 1542.30 },
      { date: '2026-04-11', spend: 193.50, impressions: 57120, clicks: 1823, conversions: 50, conversionValue: 1689.50 },
      { date: '2026-04-12', spend: 207.80, impressions: 61890, clicks: 1978, conversions: 55, conversionValue: 1892.30 },
      { date: '2026-04-13', spend: 219.40, impressions: 65240, clicks: 2089, conversions: 59, conversionValue: 2043.60 },
      { date: '2026-04-14', spend: 165.20, impressions: 48120, clicks: 1534, conversions: 38, conversionValue: 1267.40 },
      { date: '2026-04-15', spend: 189.70, impressions: 55840, clicks: 1789, conversions: 48, conversionValue: 1634.80 },
      { date: '2026-04-16', spend: 176.50, impressions: 51230, clicks: 1645, conversions: 44, conversionValue: 1489.60 },
    ],
    summary: {
      totalSpend: 5248.30,
      totalImpressions: 1524680,
      totalClicks: 48570,
      totalConversions: 1237,
      totalConversionValue: 41956.80,
      avgRoas: 7.99,
    },
  },

  // Google Ads - Daily data
  googleAds: {
    daily: [
      { date: '2026-03-18', spend: 89.50, impressions: 28450, clicks: 876, conversions: 14, conversionValue: 428.60 },
      { date: '2026-03-19', spend: 102.30, impressions: 32680, clicks: 1034, conversions: 18, conversionValue: 567.80 },
      { date: '2026-03-20', spend: 95.40, impressions: 29340, clicks: 923, conversions: 16, conversionValue: 489.50 },
      { date: '2026-03-21', spend: 118.50, impressions: 35420, clicks: 1156, conversions: 21, conversionValue: 678.90 },
      { date: '2026-03-22', spend: 134.20, impressions: 40560, clicks: 1289, conversions: 25, conversionValue: 834.50 },
      { date: '2026-03-23', spend: 148.60, impressions: 44780, clicks: 1423, conversions: 29, conversionValue: 945.60 },
      { date: '2026-03-24', spend: 92.30, impressions: 27120, clicks: 854, conversions: 13, conversionValue: 412.30 },
      { date: '2026-03-25', spend: 115.70, impressions: 34560, clicks: 1089, conversions: 20, conversionValue: 634.70 },
      { date: '2026-03-26', spend: 108.40, impressions: 32140, clicks: 1012, conversions: 18, conversionValue: 567.20 },
      { date: '2026-03-27', spend: 123.50, impressions: 37240, clicks: 1178, conversions: 22, conversionValue: 698.40 },
      { date: '2026-03-28', spend: 142.30, impressions: 42890, clicks: 1356, conversions: 27, conversionValue: 839.40 },
      { date: '2026-03-29', spend: 156.80, impressions: 47120, clicks: 1489, conversions: 31, conversionValue: 972.50 },
      { date: '2026-03-30', spend: 98.50, impressions: 29840, clicks: 943, conversions: 15, conversionValue: 438.70 },
      { date: '2026-03-31', spend: 111.20, impressions: 33450, clicks: 1056, conversions: 19, conversionValue: 587.30 },
      { date: '2026-04-01', spend: 125.40, impressions: 37680, clicks: 1192, conversions: 23, conversionValue: 728.60 },
      { date: '2026-04-02', spend: 138.60, impressions: 41230, clicks: 1306, conversions: 26, conversionValue: 811.80 },
      { date: '2026-04-03', spend: 152.30, impressions: 45840, clicks: 1456, conversions: 30, conversionValue: 945.30 },
      { date: '2026-04-04', spend: 94.50, impressions: 28340, clicks: 896, conversions: 14, conversionValue: 438.20 },
      { date: '2026-04-05', spend: 122.80, impressions: 36920, clicks: 1169, conversions: 22, conversionValue: 761.50 },
      { date: '2026-04-06', spend: 145.60, impressions: 43680, clicks: 1384, conversions: 28, conversionValue: 867.30 },
      { date: '2026-04-07', spend: 162.40, impressions: 48920, clicks: 1550, conversions: 33, conversionValue: 1031.80 },
      { date: '2026-04-08', spend: 103.70, impressions: 31230, clicks: 987, conversions: 17, conversionValue: 517.40 },
      { date: '2026-04-09', spend: 118.90, impressions: 35840, clicks: 1134, conversions: 21, conversionValue: 683.90 },
      { date: '2026-04-10', spend: 132.50, impressions: 39780, clicks: 1261, conversions: 25, conversionValue: 771.30 },
      { date: '2026-04-11', spend: 144.30, impressions: 43450, clicks: 1377, conversions: 28, conversionValue: 859.40 },
      { date: '2026-04-12', spend: 158.70, impressions: 47620, clicks: 1509, conversions: 31, conversionValue: 961.60 },
      { date: '2026-04-13', spend: 174.50, impressions: 52340, clicks: 1659, conversions: 35, conversionValue: 1121.80 },
      { date: '2026-04-14', spend: 112.80, impressions: 33970, clicks: 1078, conversions: 20, conversionValue: 634.70 },
      { date: '2026-04-15', spend: 139.40, impressions: 41890, clicks: 1328, conversions: 27, conversionValue: 817.20 },
      { date: '2026-04-16', spend: 128.30, impressions: 38560, clicks: 1223, conversions: 24, conversionValue: 744.60 },
    ],
    summary: {
      totalSpend: 3756.50,
      totalImpressions: 1165480,
      totalClicks: 35670,
      totalConversions: 722,
      totalConversionValue: 21489.30,
      avgRoas: 5.72,
    },
  },

  // TikTok Ads - Daily data
  tiktokAds: {
    daily: [
      { date: '2026-03-18', spend: 67.20, impressions: 156230, clicks: 2345, conversions: 8, conversionValue: 234.50 },
      { date: '2026-03-19', spend: 78.50, impressions: 187620, clicks: 2876, conversions: 11, conversionValue: 345.60 },
      { date: '2026-03-20', spend: 71.30, impressions: 165480, clicks: 2456, conversions: 9, conversionValue: 267.80 },
      { date: '2026-03-21', spend: 89.20, impressions: 198540, clicks: 2987, conversions: 13, conversionValue: 412.30 },
      { date: '2026-03-22', spend: 102.40, impressions: 234560, clicks: 3456, conversions: 16, conversionValue: 534.50 },
      { date: '2026-03-23', spend: 115.80, impressions: 267890, clicks: 3945, conversions: 19, conversionValue: 621.40 },
      { date: '2026-03-24', spend: 68.50, impressions: 154230, clicks: 2278, conversions: 7, conversionValue: 198.60 },
      { date: '2026-03-25', spend: 87.30, impressions: 192340, clicks: 2834, conversions: 12, conversionValue: 378.40 },
      { date: '2026-03-26', spend: 82.60, impressions: 181560, clicks: 2678, conversions: 10, conversionValue: 312.50 },
      { date: '2026-03-27', spend: 95.40, impressions: 213450, clicks: 3134, conversions: 14, conversionValue: 456.80 },
      { date: '2026-03-28', spend: 109.70, impressions: 248670, clicks: 3654, conversions: 17, conversionValue: 567.90 },
      { date: '2026-03-29', spend: 124.30, impressions: 282340, clicks: 4123, conversions: 20, conversionValue: 678.50 },
      { date: '2026-03-30', spend: 73.20, impressions: 167890, clicks: 2456, conversions: 8, conversionValue: 234.70 },
      { date: '2026-03-31', spend: 86.50, impressions: 195640, clicks: 2876, conversions: 11, conversionValue: 356.40 },
      { date: '2026-04-01', spend: 98.30, impressions: 219870, clicks: 3212, conversions: 14, conversionValue: 467.80 },
      { date: '2026-04-02', spend: 110.60, impressions: 248540, clicks: 3634, conversions: 17, conversionValue: 589.40 },
      { date: '2026-04-03', spend: 125.40, impressions: 283450, clicks: 4156, conversions: 20, conversionValue: 712.30 },
      { date: '2026-04-04', spend: 69.80, impressions: 159230, clicks: 2334, conversions: 8, conversionValue: 198.50 },
      { date: '2026-04-05', spend: 92.70, impressions: 210640, clicks: 3087, conversions: 13, conversionValue: 423.60 },
      { date: '2026-04-06', spend: 115.30, impressions: 261450, clicks: 3823, conversions: 18, conversionValue: 589.70 },
      { date: '2026-04-07', spend: 138.50, impressions: 312680, clicks: 4567, conversions: 23, conversionValue: 756.80 },
      { date: '2026-04-08', spend: 81.40, impressions: 185230, clicks: 2712, conversions: 10, conversionValue: 312.50 },
      { date: '2026-04-09', spend: 97.20, impressions: 219870, clicks: 3223, conversions: 13, conversionValue: 412.30 },
      { date: '2026-04-10', spend: 108.50, impressions: 245640, clicks: 3598, conversions: 15, conversionValue: 489.50 },
      { date: '2026-04-11', spend: 119.30, impressions: 268340, clicks: 3934, conversions: 17, conversionValue: 567.80 },
      { date: '2026-04-12', spend: 132.40, impressions: 298670, clicks: 4378, conversions: 20, conversionValue: 678.90 },
      { date: '2026-04-13', spend: 148.60, impressions: 336450, clicks: 4923, conversions: 24, conversionValue: 812.30 },
      { date: '2026-04-14', spend: 88.70, impressions: 201230, clicks: 2956, conversions: 12, conversionValue: 389.40 },
      { date: '2026-04-15', spend: 112.50, impressions: 254680, clicks: 3734, conversions: 17, conversionValue: 567.50 },
      { date: '2026-04-16', spend: 102.30, impressions: 231450, clicks: 3389, conversions: 15, conversionValue: 489.60 },
    ],
    summary: {
      totalSpend: 2987.40,
      totalImpressions: 6847230,
      totalClicks: 101240,
      totalConversions: 445,
      totalConversionValue: 14234.50,
      avgRoas: 4.76,
    },
  },
};

// Helper para calcular datas em relação à data atual
export function getMockDataForDateRange(
  range: 'today' | 'yesterday' | 'last7' | 'last30' | 'mtd' | 'custom',
  startDate?: string,
  endDate?: string,
) {
  const today = new Date('2026-04-16'); // Data fixa para testes
  const allDays = MOCK_30_DAYS_DATA.shopify.daily;

  let filteredDays: typeof allDays = [];

  switch (range) {
    case 'today':
      filteredDays = allDays.filter((d) => d.date === '2026-04-16');
      break;
    case 'yesterday':
      filteredDays = allDays.filter((d) => d.date === '2026-04-15');
      break;
    case 'last7':
      filteredDays = allDays.slice(-7);
      break;
    case 'last30':
      filteredDays = allDays;
      break;
    case 'mtd':
      filteredDays = allDays.filter((d) => d.date.startsWith('2026-04'));
      break;
    case 'custom':
      if (startDate && endDate) {
        filteredDays = allDays.filter((d) => d.date >= startDate && d.date <= endDate);
      }
      break;
  }

  return {
    dateRange: range,
    shopify: {
      daily: filteredDays.map((d) => ({
        date: d.date,
        orders: d.orders,
        revenue: d.revenue,
        uniqueCustomers: d.customers,
        uniqueReturningCustomers: d.returning,
      })),
      summary: {
        totalOrders: filteredDays.reduce((sum, d) => sum + d.orders, 0),
        totalRevenue: parseFloat(filteredDays.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)),
        avgOrderValue: parseFloat(
          (filteredDays.reduce((sum, d) => sum + d.revenue, 0) / filteredDays.reduce((sum, d) => sum + d.orders, 0)).toFixed(2),
        ),
        uniqueCustomers: filteredDays.reduce((sum, d) => sum + d.customers, 0),
        returningCustomers: filteredDays.reduce((sum, d) => sum + d.returning, 0),
      },
    },
  };
}
