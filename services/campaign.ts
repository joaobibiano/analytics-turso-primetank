import turso from "@/lib/turso";
import { subDays, format } from "date-fns";

export const getCampaings = async (period: "30d" | "90d" | "365d") => {
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
  const rs = await turso.execute({
    sql: `select campaign_id, campaign_name, start_date, end_date, budget, impressions, clicks, conversions, conversion_rate, revenue, roi, subsidiary_id from campaigns where start_date >= ? and end_date <= ?;`,
    args: [format(range.start, "yyyy-MM-dd"), format(range.end, "yyyy-MM-dd")],
  });

  return rs.rows as unknown as {
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
  }[];
};
