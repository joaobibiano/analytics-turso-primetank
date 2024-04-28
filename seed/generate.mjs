import { faker } from "@faker-js/faker";

import { createClient } from "@libsql/client/web";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("Missing TURSO_DATABASE_URL environment variable");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function randomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
}

function generateCampaigns(subsidiaryId, numCampaigns, startMonth, endMonth) {
  const campaigns = [];
  for (let i = 0; i < numCampaigns; i++) {
    const startDate = randomDate(
      new Date(2024, startMonth, 1),
      new Date(2024, endMonth, 0)
    );
    const durationDays = Math.floor(Math.random() * 10) + 3;
    const endDate = new Date(
      new Date(startDate).setDate(new Date(startDate).getDate() + durationDays)
    );
    const budget = faker.finance.amount(1000, 10000, 2);
    const impressions = +faker.string.numeric({ min: 1000, max: 10000 });
    const clicks = +faker.string.numeric({ min: 4, max: 10000 });

    // Randomize conversion rate first
    const conversionRate = parseFloat((Math.random() * 100).toFixed(2));
    const conversions = Math.round((clicks * conversionRate) / 100);

    const revenue = parseFloat(
      (
        conversions *
        faker.finance.amount(50, 100, 2)
      ).toFixed(2)
    );
    const roi = parseFloat((((revenue - budget) / budget) * 100).toFixed(2));

    campaigns.push(
      `(${subsidiaryId}, '${faker.company.catchPhrase()}', '${startDate}', '${
        endDate.toISOString().split("T")[0]
      }', ${budget}, ${impressions}, ${clicks}, ${conversions}, ${conversionRate}, ${revenue}, ${roi})`
    );
  }
  return campaigns;
}
const totalCampaigns = 100_000;
const subsidiaries = [1, 2, 3, 4, 5];
const monthlyDistribution = [
  0.05, 0.1, 0.08, 0.07, 0.1, 0.05, 0.15, 0.08, 0.12, 0.1, 0.05, 0.05,
];

let allCampaigns = [];

console.log("Generating campaigns...");
monthlyDistribution.forEach((distribution, index) => {
  console.log(`Month ${index + 1}`);
  subsidiaries.forEach((subsidiaryId) => {
    const numCampaigns = Math.floor(
      (totalCampaigns * distribution) / subsidiaries.length
    );
    const campaigns = generateCampaigns(
      subsidiaryId,
      numCampaigns,
      index,
      index + 1
    );
    allCampaigns = allCampaigns.concat(campaigns);
  });
});

const batchSize = 1000;
console.log("Inserting campaigns...");
function executeBatchInsert(campaigns) {
  const batchGroups = [];
  for (let i = 0; i < campaigns.length; i += batchSize) {
    console.log(`Inserting batch ${i / batchSize + 1}...`);
    const batch = campaigns.slice(i, i + batchSize);
    const sqlInsert =
      "INSERT INTO campaigns (subsidiary_id, campaign_name, start_date, end_date, budget, impressions, clicks, conversions, conversion_rate, revenue, roi) VALUES\n" +
      batch.join(",\n") +
      ";";
    batchGroups.push(sqlInsert);
  }
  return batchGroups;
}

const sqlBatches = executeBatchInsert(allCampaigns);

for (const sql of sqlBatches) {
  try {
    await client.execute(sql);
  } catch (err) {
    console.error(err);
    console.log(sql);
    break;
  }
}
