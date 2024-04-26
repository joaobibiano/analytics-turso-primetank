import { faker } from '@faker-js/faker';

import { createClient } from "@libsql/client/web";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("Missing TURSO_DATABASE_URL environment variable");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function randomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];  // Returns date in YYYY-MM-DD format
}

function generateCampaigns(subsidiaryId, numCampaigns, startMonth, endMonth) {
    const campaigns = [];
    for (let i = 0; i < numCampaigns; i++) {
        const startDate = randomDate(new Date(2024, startMonth, 1), new Date(2024, endMonth, 0));
        const durationDays = Math.floor(Math.random() * 10) + 3; // Shorter campaign durations
        const endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + durationDays));
        const budget = parseFloat((Math.random() * 2000 + 500).toFixed(2)); // Lower budget range
        const impressions = Math.floor(Math.random() * 50000 + 5000); // Lower range of impressions
        const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01)); // Assuming 1% to 5% click rate
        const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02)); // Conversion rate of 2% to 10%
        const conversionRate = parseFloat((conversions / clicks * 100).toFixed(2));
        const revenue = parseFloat((conversions * (Math.random() * 50 + 10)).toFixed(2)); // Lower potential revenue per conversion
        const roi = parseFloat(((revenue - budget) / budget * 100).toFixed(2));

        campaigns.push(`(${subsidiaryId}, '${faker.company.catchPhrase()}', '${startDate}', '${endDate.toISOString().split('T')[0]}', ${budget}, ${impressions}, ${clicks}, ${conversions}, ${conversionRate}, ${revenue}, ${roi})`);
    }
    return campaigns;
}

const totalCampaigns = 1000;
const subsidiaries = [1, 2, 3, 4, 5];
const monthlyDistribution = [0.05, 0.10, 0.08, 0.07, 0.10, 0.05, 0.15, 0.08, 0.12, 0.10, 0.05, 0.05];

let allCampaigns = [];

monthlyDistribution.forEach((distribution, index) => {
    subsidiaries.forEach(subsidiaryId => {
        const numCampaigns = Math.floor(totalCampaigns * distribution / subsidiaries.length);
        const campaigns = generateCampaigns(subsidiaryId, numCampaigns, index, index + 1);
        allCampaigns = allCampaigns.concat(campaigns);
    });
});

const batchSize = 1000;
function executeBatchInsert(campaigns) {
    const batchGroups = [];
    for (let i = 0; i < campaigns.length; i += batchSize) {
        const batch = campaigns.slice(i, i + batchSize);
        const sqlInsert = "INSERT INTO campaigns (subsidiary_id, campaign_name, start_date, end_date, budget, impressions, clicks, conversions, conversion_rate, revenue, roi) VALUES\n" + batch.join(",\n") + ";";
        batchGroups.push(sqlInsert);
    }
    return batchGroups;
}

const sqlBatches = executeBatchInsert(allCampaigns);


for (const sql of sqlBatches) {
    await client.execute(sql);
}

