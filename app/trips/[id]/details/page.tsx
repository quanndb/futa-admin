"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, ArrowLeft, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

// Trip details interface
interface TripDetail {
  id: string
  tripId: string
  tripCode: string
  fromDate: string
  toDate: string
  type: "SEAT" | "BED" | "VIP"
  price: number
  status: "ACTIVE" | "INACTIVE"
  createdAt: string
  lastModifiedAt: string
}

// Sample trip data
const tripData = {
  id: "trip-001",
  code: "NYC-BOS",
  name: "New York to Boston Express",
  description: "Direct express service from NYC to Boston",
  status: "ACTIVE",
}

// Sample trip details data
const tripDetailsData: TripDetail[] = [
  {
    id: "td-001",
    tripId: "trip-001",
    tripCode: "NYC-BOS",
    fromDate: "2024-05-10",
    toDate: "2024-05-31",
    type: "SEAT",
    price: 45.99,
    status: "ACTIVE",
    createdAt: "2024-04-01T10:30:00",
    lastModifiedAt: "2024-04-01T10:30:00",
  },
  {
    id: "td-002",
    tripId: "trip-001",
    tripCode: "NYC-BOS",
    fromDate: "2024-05-10",
    toDate: "2024-05-31",
    type: "BED",
    price: 75.99,
    status: "ACTIVE",
    createdAt: "2024-04-01T10:35:00",
    lastModifiedAt: "2024-04-01T10:35:00",
  },
  {
    id: "td-003",
    tripId: "trip-001",
    tripCode: "NYC-BOS",
    fromDate: "2024-06-01",
    toDate: "2024-06-30",
    type: "SEAT",
    price: 49.99,
    status: "INACTIVE",
    createdAt: "2024-04-15T14:20:00",
    lastModifiedAt: "2024-04-15T14:20:00",
  },
]

export default function TripDetailsPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState(tripData)
  const [tripDetails, setTripDetails] = useState<TripDetail[]>(tripDetailsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTripDetail, setCurrentTripDetail] = useState<TripDetail | null>(null)
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    type: "SEAT" as "SEAT" | "BED" | "VIP",
    price: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as "SEAT" | "BED" | "VIP",
    })
  }

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as "ACTIVE" | "INACTIVE",
    })
  }

  const resetForm = () => {
    setFormData({
      fromDate: "",
      toDate: "",
      type: "SEAT",
      price: "",
      status: "ACTIVE",
    })
  }

  const handleAddTripDetail = () => {
    const newTripDetail: TripDetail = {
      id: `td-${String(tripDetails.length + 1).padStart(3, "0")}`,
      tripId,
      tripCode: trip.code,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      type: formData.type,
      price: Number.parseFloat(formData.price),
      status: formData.status,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
    }

    setTripDetails([...tripDetails, newTripDetail])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Trip Detail Added",
      description: `Trip detail for ${formData.type} has been added successfully.`,
    })
  }

  const handleEditClick = (tripDetail: TripDetail) => {
    setCurrentTripDetail(tripDetail)
    setFormData({
      fromDate: tripDetail.fromDate,
      toDate: tripDetail.toDate,
      type: tripDetail.type,
      price: tripDetail.price.toString(),
      status: tripDetail.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTripDetail = () => {
    if (!currentTripDetail) return

    const updatedTripDetails = tripDetails.map((detail) =>
      detail.id === currentTripDetail.id
        ? {
            ...detail,
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            type: formData.type,
            price: Number.parseFloat(formData.price),
            status: formData.status,
            lastModifiedAt: new Date().toISOString(),
          }
        : detail,
    )

    setTripDetails(updatedTripDetails)
    setIsEditDialogOpen(false)
    resetForm()
    toast({
      title: "Trip Detail Updated",
      description: `Trip detail for ${formData.type} has been updated successfully.`,
    })
  }

  const handleDeleteClick = (tripDetail: TripDetail) => {
    setCurrentTripDetail(tripDetail)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTripDetail = () => {
    if (!currentTripDetail) return

    const updatedTripDetails = tripDetails.filter((detail) => detail.id !== currentTripDetail.id)
    setTripDetails(updatedTripDetails)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Trip Detail Deleted",
      description: `Trip detail has been deleted successfully.`,
      variant: "destructive",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>
      case "INACTIVE":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "SEAT":
        return "Standard Seat"
      case "BED":
        return "Sleeper Bed"
      case "VIP":
        return "VIP Service"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/trips">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Trip Details</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Trip Detail
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Trip Detail</DialogTitle>
                <DialogDescription>Enter the details for this trip schedule.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fromDate" className="text-right">
                    From Date
                  </Label>
                  <Input
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    className="col-span-3"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="toDate" className="text-right">
                    To Date
                  </Label>
                  <Input
                    id="toDate"
                    name="toDate"
                    type="date"
                    className="col-span-3"
                    value={formData.toDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEAT">Standard Seat</SelectItem>
                      <SelectItem value="BED">Sleeper Bed</SelectItem>
                      <SelectItem value="VIP">VIP Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="col-span-3"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTripDetail}
                  disabled={!formData.fromDate || !formData.toDate || !formData.price}
                >
                  Add Trip Detail
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{trip.name}</CardTitle>
            <CardDescription>
              Code: {trip.code} | Status: {trip.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Trip Schedules and Pricing</h3>
              <p className="text-sm text-muted-foreground">Manage schedules and pricing for this trip.</p>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tripDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No trip details found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tripDetails.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="font-medium">{detail.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {formatDate(detail.fromDate)} - {formatDate(detail.toDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeLabel(detail.type)}</TableCell>
                        <TableCell>${detail.price.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(detail.status)}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditClick(detail)}>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(detail)} className="text-destructive">
                                Delete
                              </DropdownMenuItem>
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
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Trip Detail</DialogTitle>
            <DialogDescription>Update the details for this trip schedule.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-fromDate" className="text-right">
                From Date
              </Label>
              <Input
                id="edit-fromDate"
                name="fromDate"
                type="date"
                className="col-span-3"
                value={formData.fromDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-toDate" className="text-right">
                To Date
              </Label>
              <Input
                id="edit-toDate"
                name="toDate"
                type="date"
                className="col-span-3"
                value={formData.toDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEAT">Standard Seat</SelectItem>
                  <SelectItem value="BED">Sleeper Bed</SelectItem>
                  <SelectItem value="VIP">VIP Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price ($)
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                className="col-span-3"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTripDetail}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip detail? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTripDetail}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </DashboardLayout>
  )
}
