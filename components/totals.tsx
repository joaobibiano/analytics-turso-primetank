import { getTotals } from "@/services/campaign";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChartIcon, CurrencyIcon, ShoppingCartIcon } from "lucide-react";

export const dynamic = "force-dynamic";
export const Totals = async ({ subsidiaryId }: any) => {
  const totals = await getTotals({ subsidiaryId });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card>
        <CardHeader className="flex items-center mb-4">
          <BarChartIcon className="h-8 w-8 text-blue-500 mr-4" />
          <CardTitle>Campaign Reach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              maximumSignificantDigits: 6,
            }).format(totals.impressions)}
          </div>
          <p className="text-gray-500 ">Unique Visitors</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center mb-4">
          <ShoppingCartIcon className="h-8 w-8 text-green-500 mr-4" />
          <CardTitle>Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(totals.conversion_rate)}
            %
          </div>
          <p className="text-gray-500 ">Leads to Sales</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center mb-4">
          <CurrencyIcon className="h-8 w-8 text-yellow-500 mr-4" />
          <CardTitle>Revenue Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              maximumSignificantDigits: 6,
              style: "currency",
              currency: "USD",
            }).format(totals.revenue)}
          </div>
          <p className="text-gray-500 ">Total Sales</p>
        </CardContent>
      </Card>
    </div>
  );
};
