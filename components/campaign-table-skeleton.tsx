import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import ReactLoadingSkeleton from "react-loading-skeleton"

export function CampaignTableLoading() {
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
            {new Array(10).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <ReactLoadingSkeleton width={200} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
                <TableCell>
                  <ReactLoadingSkeleton width={50} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
