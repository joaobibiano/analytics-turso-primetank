import turso from "@/lib/turso";
import { subDays, format } from "date-fns";

export const getSubsidiaries = async () => {
  const rs = await turso.execute({
    sql: `SELECT subsidiary_id, subsidiary_name FROM subsidiaries;`,
    args: [],
  });

  return rs.rows as unknown as {
    subsidiary_id: number;
    subsidiary_name: string;
  }[];
};

export const getCampaigns = async (
  period: "30d" | "90d" | "365d",
  page: number,
  pageSize: number,
  subsidiaryId: number
) => {
  const range = (() => {
    const baseDate = new Date();
    if (period === "30d") {
      return {
        start: subDays(baseDate, 30),
        end: baseDate,
      };
    } else if (period === "90d") {
      return {
        start: subDays(baseDate, 90),
        end: baseDate,
      };
    }

    return {
      start: subDays(baseDate, 365),
      end: baseDate,
    };
  })();

  const offset = (page - 1) * pageSize;

  const rs = await turso.execute({
    sql: `SELECT campaign_id, campaign_name, start_date, end_date, budget, impressions, clicks, conversions, conversion_rate, revenue, roi, subsidiary_id FROM campaigns WHERE start_date >= ? AND end_date <= ? AND subsidiary_id = ? LIMIT ? OFFSET ?;`,
    args: [
      format(range.start, "yyyy-MM-dd"),
      format(range.end, "yyyy-MM-dd"),
      subsidiaryId,
      pageSize,
      offset,
    ],
  });

  const totalCount = await turso.execute({
    sql: `SELECT COUNT(*) as total FROM campaigns WHERE start_date >= ? AND end_date <= ? AND subsidiary_id = ?;`,
    args: [
      format(range.start, "yyyy-MM-dd"),
      format(range.end, "yyyy-MM-dd"),
      subsidiaryId,
    ],
  });

  const totalPages = Math.ceil(
    ((totalCount?.rows[0]?.total as number) ?? 0) / pageSize
  );

  return {
    campaigns: rs.rows as unknown as {
      campaign_id: number;
      campaign_name: string;
      start_date: string;
      end_date: string;
      budget: number;
      impressions: number;
      clicks: number;
      conversions: number;
      conversion_rate: number;
      revenue: number;
      roi: number;
      subsidiary_id: number;
    }[],
    pagination: {
      page,
      pageSize,
      totalCount: totalCount.rows[0].total as number,
      totalPages,
    },
  };
};

export const getChartData = async (
  period: "30d" | "90d" | "365d",
  subsidiaryId: number
) => {
  let rs;

if (period === "30d") {
    rs = await turso.execute({
      sql: `
        SELECT strftime('%Y-%W%W', start_date) as x, AVG(conversion_rate) as y
        FROM campaigns
        WHERE start_date >= date('now', '-30 days') AND subsidiary_id = ?
        GROUP BY strftime('%Y-%W%W', start_date);
      `,
      args: [subsidiaryId],
    });}
else if (period === "90d") {
    rs = await turso.execute({
      sql: `
        SELECT strftime('%Y-%W%W', start_date) as x, AVG(conversion_rate) as y
        FROM campaigns
        WHERE start_date >= date('now', '-90 days') AND subsidiary_id = ?
        GROUP BY strftime('%Y-%W%W', start_date);
      `,
      args: [subsidiaryId],
    });
  } else {
    rs = await turso.execute({
      sql: `
        SELECT strftime('%Y-%m', start_date) as x, AVG(conversion_rate) as y
        FROM campaigns
        WHERE start_date >= date('now', '-365 days') AND subsidiary_id = ?
        GROUP BY strftime('%Y-%m', start_date);
      `,
      args: [subsidiaryId],
    });
  }

  const simpleArray = rs.rows.map((row) => ({
    x: row.x?.toString(),
    y: row.y?.toString(),
  }));

  return simpleArray;
};

export const getTotals = async ({ subsidiaryId }: { subsidiaryId: number }) => {
  const rs = await turso.execute({
    sql: `SELECT SUM(impressions) as impressions, AVG(conversion_rate) as conversion_rate, SUM(revenue) as revenue FROM campaigns where subsidiary_id = ? ;`,
    args: [subsidiaryId],
  });

  return {
    impressions: rs.rows[0].impressions as number,
    conversion_rate: rs.rows[0].conversion_rate as number,
    revenue: rs.rows[0].revenue as number,
  };
};
