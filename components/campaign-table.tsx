import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { getCampaings } from "@/services/campaign"

export async function CampaignTable({ period } : { period: string}) {
  const data = await getCampaings(period as any)

  return (
    <div className="border rounded-lg w-full">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Conversions</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead>ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((campaign) => (
              <TableRow key={campaign.campaign_id}>
                <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
                <TableCell>{campaign.start_date}</TableCell>
                <TableCell>{campaign.end_date}</TableCell>
                <TableCell>{campaign.budget}</TableCell>
                <TableCell>{campaign.impressions}</TableCell>
                <TableCell>{campaign.clicks}</TableCell>
                <TableCell>{campaign.conversions}</TableCell>
                <TableCell>{campaign.conversion_rate}</TableCell>
                <TableCell>{campaign.roi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
