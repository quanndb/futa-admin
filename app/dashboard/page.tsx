"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CreditCard, DollarSign, Bus } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Dữ liệu mẫu cho biểu đồ
const monthlyData = [
  { name: "T1", revenue: 4000, bookings: 240, trips: 40 },
  { name: "T2", revenue: 3000, bookings: 198, trips: 35 },
  { name: "T3", revenue: 5000, bookings: 300, trips: 45 },
  { name: "T4", revenue: 4500, bookings: 270, trips: 42 },
  { name: "T5", revenue: 6000, bookings: 360, trips: 50 },
  { name: "T6", revenue: 5500, bookings: 330, trips: 48 },
  { name: "T7", revenue: 7000, bookings: 420, trips: 55 },
  { name: "T8", revenue: 6500, bookings: 390, trips: 52 },
  { name: "T9", revenue: 8000, bookings: 480, trips: 60 },
  { name: "T10", revenue: 7500, bookings: 450, trips: 58 },
  { name: "T11", revenue: 9000, bookings: 540, trips: 65 },
  { name: "T12", revenue: 9500, bookings: 570, trips: 68 },
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

  // Tính tổng
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0)
  const totalTrips = data.reduce((sum, item) => sum + item.trips, 0)
  const averageRevenuePerBooking = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Theo tháng</SelectItem>
                <SelectItem value="yearly">Theo năm</SelectItem>
              </SelectContent>
            </Select>
            {period === "monthly" && (
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Chọn năm" />
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
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} VNĐ</div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly" ? `Cho năm ${year}` : "Tất cả thời gian"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đặt vé</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly" ? `Cho năm ${year}` : "Tất cả thời gian"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng chuyến đi</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrips.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly" ? `Cho năm ${year}` : "Tất cả thời gian"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TB. Doanh thu/Vé</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(averageRevenuePerBooking).toLocaleString()} VNĐ</div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly" ? `Cho năm ${year}` : "Tất cả thời gian"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="bookings">Đặt vé</TabsTrigger>
            <TabsTrigger value="trips">Chuyến đi</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>
                  {period === "monthly" ? `Doanh thu theo tháng cho năm ${year}` : "Tổng quan doanh thu theo năm"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Doanh thu",
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
                <CardTitle>Tổng quan đặt vé</CardTitle>
                <CardDescription>
                  {period === "monthly" ? `Đặt vé theo tháng cho năm ${year}` : "Tổng quan đặt vé theo năm"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    bookings: {
                      label: "Đặt vé",
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
                <CardTitle>Tổng quan chuyến đi</CardTitle>
                <CardDescription>
                  {period === "monthly" ? `Chuyến đi theo tháng cho năm ${year}` : "Tổng quan chuyến đi theo năm"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    trips: {
                      label: "Chuyến đi",
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
