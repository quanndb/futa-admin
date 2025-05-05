"use client"

import type React from "react"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, Search, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

// Trip interface
interface Trip {
  id: string
  code: string
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE"
  transitCount: number
  detailsCount: number
  createdAt: string
  lastModifiedAt: string
}

// Sample trips data
const tripsData: Trip[] = [
  {
    id: "trip-001",
    code: "NYC-BOS",
    name: "New York to Boston Express",
    description: "Direct express service from NYC to Boston",
    status: "ACTIVE",
    transitCount: 4,
    detailsCount: 3,
    createdAt: "2024-01-15T10:30:00",
    lastModifiedAt: "2024-01-15T10:30:00",
  },
  {
    id: "trip-002",
    code: "BOS-DC",
    name: "Boston to Washington DC",
    description: "Premium service with stops in major cities",
    status: "ACTIVE",
    transitCount: 6,
    detailsCount: 2,
    createdAt: "2024-01-20T14:45:00",
    lastModifiedAt: "2024-02-05T09:15:00",
  },
  {
    id: "trip-003",
    code: "DC-PHI",
    name: "DC to Philadelphia",
    description: "Quick service between DC and Philadelphia",
    status: "INACTIVE",
    transitCount: 3,
    detailsCount: 1,
    createdAt: "2024-02-10T09:15:00",
    lastModifiedAt: "2024-02-10T09:15:00",
  },
  {
    id: "trip-004",
    code: "PHI-NYC",
    name: "Philadelphia to New York",
    description: "Regular service with comfort amenities",
    status: "ACTIVE",
    transitCount: 5,
    detailsCount: 4,
    createdAt: "2024-02-15T16:20:00",
    lastModifiedAt: "2024-02-15T16:20:00",
  },
  {
    id: "trip-005",
    code: "NYC-DC",
    name: "New York to Washington DC Direct",
    description: "Non-stop premium service",
    status: "ACTIVE",
    transitCount: 2,
    detailsCount: 2,
    createdAt: "2024-03-01T11:40:00",
    lastModifiedAt: "2024-03-01T11:40:00",
  },
]

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(tripsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  })

  // Filter trips based on search query and status filter
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
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
      code: "",
      name: "",
      description: "",
      status: "ACTIVE",
    })
  }

  const handleAddTrip = () => {
    const newTrip: Trip = {
      id: `trip-${String(trips.length + 1).padStart(3, "0")}`,
      ...formData,
      transitCount: 0,
      detailsCount: 0,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
    }

    setTrips([...trips, newTrip])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Trip Added",
      description: `${newTrip.name} has been added successfully.`,
    })
  }

  const handleEditClick = (trip: Trip) => {
    setCurrentTrip(trip)
    setFormData({
      code: trip.code,
      name: trip.name,
      description: trip.description,
      status: trip.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTrip = () => {
    if (!currentTrip) return

    const updatedTrips = trips.map((trip) =>
      trip.id === currentTrip.id
        ? {
            ...trip,
            ...formData,
            lastModifiedAt: new Date().toISOString(),
          }
        : trip,
    )

    setTrips(updatedTrips)
    setIsEditDialogOpen(false)
    resetForm()
    toast({
      title: "Trip Updated",
      description: `${formData.name} has been updated successfully.`,
    })
  }

  const handleDeleteClick = (trip: Trip) => {
    setCurrentTrip(trip)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTrip = () => {
    if (!currentTrip) return

    const updatedTrips = trips.filter((trip) => trip.id !== currentTrip.id)
    setTrips(updatedTrips)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Trip Deleted",
      description: `${currentTrip.name} has been deleted successfully.`,
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Trips</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Trip</DialogTitle>
                <DialogDescription>Enter the details for the new trip.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="code" className="text-right">
                    Code
                  </label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g. NYC-BOS"
                    className="col-span-3"
                    value={formData.code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. New York to Boston Express"
                    className="col-span-3"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">
                    Description
                  </label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="e.g. Direct express service"
                    className="col-span-3"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="status" className="text-right">
                    Status
                  </label>
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
                <Button onClick={handleAddTrip}>Add Trip</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Trips</CardTitle>
            <CardDescription>Manage all trips in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search trips..."
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Transit Points</TableHead>
                    <TableHead>Trip Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No trips found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">{trip.id}</TableCell>
                        <TableCell>{trip.code}</TableCell>
                        <TableCell>{trip.name}</TableCell>
                        <TableCell>
                          <Link href={`/trips/${trip.id}/transits`} className="flex items-center hover:underline">
                            <span>{trip.transitCount} points</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/trips/${trip.id}/details`} className="flex items-center hover:underline">
                            <span>{trip.detailsCount} details</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(trip.status)}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditClick(trip)}>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(trip)} className="text-destructive">
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
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>Update the details for this trip.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-code" className="text-right">
                Code
              </label>
              <Input
                id="edit-code"
                name="code"
                className="col-span-3"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Name
              </label>
              <Input
                id="edit-name"
                name="name"
                className="col-span-3"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-description" className="text-right">
                Description
              </label>
              <Input
                id="edit-description"
                name="description"
                className="col-span-3"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-status" className="text-right">
                Status
              </label>
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
            <Button onClick={handleUpdateTrip}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the trip "{currentTrip?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrip}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </DashboardLayout>
  )
}
