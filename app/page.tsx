import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { CampaignTable } from "@/components/campaign-table"
import { LineChart } from "./Chart"
import { ChevronDownIcon, CurrencyIcon, ShoppingCartIcon } from "lucide-react"
import { getCampaings } from "@/services/campaign"
import { Suspense } from "react"
import { CampaignTableLoading } from "@/components/campaign-table-skeleton"

async function Dashboard({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const period = searchParams.period as string

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-950 text-white py-4 px-6 md:px-12 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-12">
            <Link className="flex items-end" href="#">
              <span className="text-xs">Analytics<br/>Dashboard</span>
            </Link>

            <div className="ml-6 text-base font-medium">
              <div className="flex items-center">
                <span className="mr-2 text-2xl">Acme Inc</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-2" size="icon" variant="ghost">
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Acme Inc</DropdownMenuItem>
                    <DropdownMenuItem>Subsidiary A</DropdownMenuItem>
                    <DropdownMenuItem>Subsidiary B</DropdownMenuItem>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="flex items-center mb-4">
                <BarChartIcon className="h-8 w-8 text-blue-500 mr-4" />
                <CardTitle>Campaign Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">12.4K</div>
                <p className="text-gray-500 ">Unique Visitors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center mb-4">
                <ShoppingCartIcon className="h-8 w-8 text-green-500 mr-4" />
                <CardTitle>Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">17.8%</div>
                <p className="text-gray-500 ">Leads to Sales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center mb-4">
                <CurrencyIcon className="h-8 w-8 text-yellow-500 mr-4" />
                <CardTitle>Revenue Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$84.2K</div>
                <p className="text-gray-500 ">Total Sales</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <CardTitle>Campaign Performance</CardTitle>
              <div className="flex space-x-4">
                <Link href={{
                  pathname: '/',
                  query: { period: '30d' }
                }}>
                  <Button variant="outline">Last 30 Days</Button>
                </Link>
                <Link href={{
                  pathname: '/',
                  query: { period: '90d' }
                }}>
                  <Button variant="outline">Last 90 Days</Button>
                </Link>
                <Link href={{
                  pathname: '/',
                  query: { period: '365d' }
                }}>
                  <Button variant="outline">Last Year</Button>
                </Link>
              </div>
            </div>
            {/* <Card> */}
            {/*   <CardContent> */}
            {/*     <LineChart className="aspect-[16/9]" /> */}
            {/*   </CardContent> */}
            {/* </Card> */}
          </div>
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <CardTitle>Top Performing Campaigns</CardTitle>
              <Button variant="outline">View All</Button>
            </div>
            <Card>
              <Suspense fallback={<CampaignTableLoading />}>
                <CampaignTable period={period} />
              </Suspense>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-gray-950 text-white py-6 px-6 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">© 2024 Analytics Dashboard. All rights reserved.</p>
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
  )
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

export default Dashboard
