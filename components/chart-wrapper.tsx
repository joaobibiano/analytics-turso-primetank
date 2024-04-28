import { getChartData } from "@/services/campaign";
import { LineChart } from "./chart";

export async function ChartWrapper({ period, subsidiaryId, ...rest }: any) {
  const data = await getChartData(period, subsidiaryId);

  return <LineChart data={data} {...rest} />;
}
