"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CreditCard, DollarSign, Bus } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Sample data for charts
const monthlyData = [
  { name: "Jan", revenue: 4000, bookings: 240, trips: 40 },
  { name: "Feb", revenue: 3000, bookings: 198, trips: 35 },
  { name: "Mar", revenue: 5000, bookings: 300, trips: 45 },
  { name: "Apr", revenue: 4500, bookings: 270, trips: 42 },
  { name: "May", revenue: 6000, bookings: 360, trips: 50 },
  { name: "Jun", revenue: 5500, bookings: 330, trips: 48 },
  { name: "Jul", revenue: 7000, bookings: 420, trips: 55 },
  { name: "Aug", revenue: 6500, bookings: 390, trips: 52 },
  { name: "Sep", revenue: 8000, bookings: 480, trips: 60 },
  { name: "Oct", revenue: 7500, bookings: 450, trips: 58 },
  { name: "Nov", revenue: 9000, bookings: 540, trips: 65 },
  { name: "Dec", revenue: 9500, bookings: 570, trips: 68 },
]

const yearlyData = [
  { name: "2020", revenue: 45000, bookings: 2700, trips: 450 },
  { name: "2021", revenue: 52000, bookings: 3120, trips: 520 },
  { name: "2022", revenue: 61000, bookings: 3660, trips: 610 },
  { name: "2023", revenue: 72000, bookings: 4320, trips: 720 },
  { name: "2024", revenue: 85000, bookings: 5100, trips: 850 },
]

export default function DashboardPage() {
  const [period, setPeriod] = useState("monthly")
  const [year, setYear] = useState("2024")

  const data = period === "monthly" ? monthlyData : yearlyData

  // Calculate totals
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0)
  const totalTrips = data.reduce((sum, item) => sum + item.trips, 0)
  const averageRevenuePerBooking = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {period === "monthly" && (
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{period === "monthly" ? `For ${year}` : "All time"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{period === "monthly" ? `For ${year}` : "All time"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrips.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{period === "monthly" ? `For ${year}` : "All time"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Revenue/Booking</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageRevenuePerBooking}</div>
              <p className="text-xs text-muted-foreground">{period === "monthly" ? `For ${year}` : "All time"}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  {period === "monthly" ? `Monthly revenue for ${year}` : "Yearly revenue overview"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Overview</CardTitle>
                <CardDescription>
                  {period === "monthly" ? `Monthly bookings for ${year}` : "Yearly bookings overview"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    bookings: {
                      label: "Bookings",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="bookings" fill="var(--color-bookings)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trips Overview</CardTitle>
                <CardDescription>
                  {period === "monthly" ? `Monthly trips for ${year}` : "Yearly trips overview"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    trips: {
                      label: "Trips",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="trips" fill="var(--color-trips)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
