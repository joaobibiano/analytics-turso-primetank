import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { CardTitle, CardContent, Card } from "@/components/ui/card";
import { CampaignTable } from "@/components/campaign-table";
import { ChartWrapper } from "@/components/chart-wrapper";
import { ChevronDownIcon } from "lucide-react";
import { Suspense } from "react";
import { CampaignTableLoading } from "@/components/campaign-table-skeleton";
import { Totals } from "@/components/totals";
import { getSubsidiaries } from "@/services/campaign";

export const dynamic = "force-dynamic";

async function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const period = searchParams.period as string;
  const page = searchParams.page as string;
  const subsidiaryId = searchParams.subsidiary as string;
  const subsidiares = await getSubsidiaries();
  const activeSubsidiary =
    subsidiares.find(
      (subsidiary) => subsidiary.subsidiary_id === +subsidiaryId,
    ) || subsidiares[0];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-950 text-white py-4 px-6 md:px-12 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-12">
            <Link className="flex items-end" href="#">
              <span className="text-xs">
                Analytics
                <br />
                Dashboard
              </span>
            </Link>

            <div className="ml-6 text-base font-medium">
              <div className="flex items-center">
                <span className="mr-2 text-2xl">
                  {activeSubsidiary?.subsidiary_name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-2" size="icon" variant="ghost">
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {subsidiares.map((subsidiary) => (
                      <Link
                        key={subsidiary.subsidiary_id}
                        href={{
                          pathname: "/",
                          query: { subsidiary: subsidiary.subsidiary_id },
                        }}
                      >
                        <DropdownMenuItem>
                          {subsidiary.subsidiary_name}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link className="hover:underline" href="#">
              Dashboard
            </Link>
            <Link className="hover:underline" href="#">
              Insights
            </Link>
            <Link className="hover:underline" href="#">
              Reports
            </Link>
            <Link className="hover:underline" href="#">
              Settings
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9">
                  <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpeg" />
                  <AvatarFallback>JB</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-100">
        <div className="container mx-auto py-12 px-6 md:px-12">
          <Totals subsidiaryId={activeSubsidiary.subsidiary_id} />
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <CardTitle>Campaign Performance</CardTitle>
              <div className="flex space-x-4">
                <Link
                  href={{
                    pathname: "/",
                    query: { period: "30d", subsidiary: activeSubsidiary.subsidiary_id}
                  }}
                >
                  <Button variant="outline">Last 30 Days</Button>
                </Link>
                <Link
                  href={{
                    pathname: "/",
                    query: { period: "90d", subsidiary: activeSubsidiary.subsidiary_id }
                  }}
                >
                  <Button variant="outline">Last 90 Days</Button>
                </Link>
                <Link
                  href={{
                    pathname: "/",
                    query: { period: "365d", subsidiary: activeSubsidiary.subsidiary_id }
                  }}
                >
                  <Button variant="outline">Last Year</Button>
                </Link>
              </div>
            </div>
            <Card>
              <CardContent>
                <ChartWrapper subsidiaryId={activeSubsidiary.subsidiary_id} period={period} className="aspect-[17/9]" />
              </CardContent>
            </Card>
          </div>
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <CardTitle>Top Performing Campaigns</CardTitle>
            </div>
            <Card>
              <Suspense fallback={<CampaignTableLoading />}>
                <CampaignTable subsidiaryId={activeSubsidiary.subsidiary_id} period={period} page={page ? +page : 1} />
              </Suspense>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-gray-950 text-white py-6 px-6 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            © 2024 Analytics Dashboard. All rights reserved.
          </p>
          <nav className="flex space-x-4">
            <Link className="hover:underline" href="#">
              About
            </Link>
            <Link className="hover:underline" href="#">
              Features
            </Link>
            <Link className="hover:underline" href="#">
              Pricing
            </Link>
            <Link className="hover:underline" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
