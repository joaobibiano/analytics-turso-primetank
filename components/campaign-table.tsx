import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getCampaigns } from "@/services/campaign";

export const dynamic = 'force-dynamic'
export async function CampaignTable({
  period,
  page = 1,
  subsidiaryId,
}: {
  period: string;
  page: number;
  subsidiaryId: number;
}) {
  const data = await getCampaigns(period as any, page, 10, subsidiaryId);
  const pagination = data.pagination;

  return (
    <div className="flex flex-col justify-end">
      <span className="text-gray-500 text-right w-full p-3 text-sm">Total Results: {pagination.totalCount}</span>
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
              {data.campaigns.map((campaign) => (
                <TableRow key={campaign.campaign_id}>
                  <TableCell className="font-medium">
                    {campaign.campaign_name}
                  </TableCell>
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
      <Pagination className="mt-3 mb-3">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={{
                pathname: "/",
                query: { page: page === 1 ? 1 : page - 1, subsidiary: subsidiaryId },
              }}
            />
          </PaginationItem>
          {Array.from({ length: pagination.totalPages }, (_, index) => {
            if (
              index + 1 >= pagination.page - 1 &&
              index + 1 <= pagination.page + 1
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    href={{
                      pathname: "/",
                      query: { page: index + 1, subsidiary: subsidiaryId },
                    }}
                    isActive={index + 1 === pagination.page}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}
          <PaginationItem>
            <PaginationNext
              href={{
                pathname: "/",
                query: { page: page === pagination.totalPages ? pagination.totalPages : page + 1, subsidiary: subsidiaryId },
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
