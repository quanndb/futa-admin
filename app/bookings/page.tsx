"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, Calendar, User, Bus } from "lucide-react"

// Sample booking data
const bookingsData = [
  {
    id: "BK-001",
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    tripId: "TRIP-001",
    route: "New York to Boston",
    departureDate: "2024-05-15T08:00:00",
    seats: 2,
    amount: 91.98,
    paymentMethod: "Credit Card",
    status: "confirmed",
    bookingDate: "2024-05-01T14:23:45",
  },
  {
    id: "BK-002",
    customerName: "Emily Johnson",
    customerEmail: "emily.j@example.com",
    tripId: "TRIP-002",
    route: "Boston to Washington DC",
    departureDate: "2024-05-16T09:30:00",
    seats: 1,
    amount: 65.5,
    paymentMethod: "PayPal",
    status: "confirmed",
    bookingDate: "2024-05-02T09:15:22",
  },
  {
    id: "BK-003",
    customerName: "Michael Brown",
    customerEmail: "mbrown@example.com",
    tripId: "TRIP-001",
    route: "New York to Boston",
    departureDate: "2024-05-15T08:00:00",
    seats: 3,
    amount: 137.97,
    paymentMethod: "Credit Card",
    status: "cancelled",
    bookingDate: "2024-05-01T18:45:10",
  },
  {
    id: "BK-004",
    customerName: "Sarah Wilson",
    customerEmail: "swilson@example.com",
    tripId: "TRIP-005",
    route: "New York to Washington DC",
    departureDate: "2024-05-19T06:45:00",
    seats: 2,
    amount: 144.0,
    paymentMethod: "Debit Card",
    status: "confirmed",
    bookingDate: "2024-05-03T11:32:18",
  },
  {
    id: "BK-005",
    customerName: "David Lee",
    customerEmail: "dlee@example.com",
    tripId: "TRIP-004",
    route: "Philadelphia to New York",
    departureDate: "2024-05-18T14:00:00",
    seats: 4,
    amount: 169.0,
    paymentMethod: "Credit Card",
    status: "pending",
    bookingDate: "2024-05-04T15:20:33",
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(bookingsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Filter bookings based on search query and status filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const viewBookingDetails = (booking: any) => {
    setSelectedBooking(booking)
    setIsDetailsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>View and manage all customer bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search bookings..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Trip</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.customerName}</TableCell>
                        <TableCell>{booking.route}</TableCell>
                        <TableCell>{formatDate(booking.departureDate)}</TableCell>
                        <TableCell>{booking.seats}</TableCell>
                        <TableCell>${booking.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => viewBookingDetails(booking)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {booking.status !== "cancelled" && <DropdownMenuItem>Cancel Booking</DropdownMenuItem>}
                              {booking.status === "pending" && <DropdownMenuItem>Confirm Booking</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Complete information about the booking.</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p className="font-medium">{selectedBooking.customerName}</p>
                        <p className="text-muted-foreground">{selectedBooking.customerEmail}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Booking Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">ID:</span> {selectedBooking.id}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> {formatDate(selectedBooking.bookingDate)}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span> {selectedBooking.status}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Bus className="mr-2 h-4 w-4" />
                      Trip Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <span className="font-medium">Trip ID:</span> {selectedBooking.tripId}
                        </p>
                        <p>
                          <span className="font-medium">Route:</span> {selectedBooking.route}
                        </p>
                        <p>
                          <span className="font-medium">Departure:</span> {formatDate(selectedBooking.departureDate)}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Seats:</span> {selectedBooking.seats}
                        </p>
                        <p>
                          <span className="font-medium">Amount:</span> ${selectedBooking.amount.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-medium">Payment:</span> {selectedBooking.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end gap-2">
                  {selectedBooking.status !== "cancelled" && <Button variant="destructive">Cancel Booking</Button>}
                  {selectedBooking.status === "pending" && <Button>Confirm Booking</Button>}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
