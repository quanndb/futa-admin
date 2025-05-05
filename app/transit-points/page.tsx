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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, Search, MapPin, Building } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Transit point type enum
type TransitPointType = "PLACE" | "STATION" | "OFFICE" | "TRANSPORT"

// Transit point interface
interface TransitPoint {
  id: string
  name: string
  address: string
  hotline: string
  type: TransitPointType
  createdAt: string
  lastModifiedAt: string
}

// Sample transit points data
const transitPointsData: TransitPoint[] = [
  {
    id: "tp-001",
    name: "Central Bus Station",
    address: "123 Main St, New York, NY",
    hotline: "+1 (555) 123-4567",
    type: "STATION",
    createdAt: "2024-01-15T10:30:00",
    lastModifiedAt: "2024-01-15T10:30:00",
  },
  {
    id: "tp-002",
    name: "Downtown Office",
    address: "456 Broadway, New York, NY",
    hotline: "+1 (555) 234-5678",
    type: "OFFICE",
    createdAt: "2024-01-20T14:45:00",
    lastModifiedAt: "2024-02-05T09:15:00",
  },
  {
    id: "tp-003",
    name: "Airport Terminal",
    address: "JFK Airport, Queens, NY",
    hotline: "+1 (555) 345-6789",
    type: "TRANSPORT",
    createdAt: "2024-02-10T09:15:00",
    lastModifiedAt: "2024-02-10T09:15:00",
  },
  {
    id: "tp-004",
    name: "Shopping Mall",
    address: "789 5th Ave, New York, NY",
    hotline: "+1 (555) 456-7890",
    type: "PLACE",
    createdAt: "2024-02-15T16:20:00",
    lastModifiedAt: "2024-02-15T16:20:00",
  },
  {
    id: "tp-005",
    name: "University Campus",
    address: "100 University Dr, Boston, MA",
    hotline: "+1 (555) 567-8901",
    type: "PLACE",
    createdAt: "2024-03-01T11:40:00",
    lastModifiedAt: "2024-03-01T11:40:00",
  },
]

export default function TransitPointsPage() {
  const [transitPoints, setTransitPoints] = useState<TransitPoint[]>(transitPointsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTransitPoint, setCurrentTransitPoint] = useState<TransitPoint | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    hotline: "",
    type: "PLACE" as TransitPointType,
  })

  // Filter transit points based on search query and type filter
  const filteredTransitPoints = transitPoints.filter((point) => {
    const matchesSearch =
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || point.type === typeFilter
    return matchesSearch && matchesType
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
      type: value as TransitPointType,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      hotline: "",
      type: "PLACE",
    })
  }

  const handleAddTransitPoint = () => {
    const newTransitPoint: TransitPoint = {
      id: `tp-${String(transitPoints.length + 1).padStart(3, "0")}`,
      ...formData,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
    }

    setTransitPoints([...transitPoints, newTransitPoint])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Transit Point Added",
      description: `${newTransitPoint.name} has been added successfully.`,
    })
  }

  const handleEditClick = (transitPoint: TransitPoint) => {
    setCurrentTransitPoint(transitPoint)
    setFormData({
      name: transitPoint.name,
      address: transitPoint.address,
      hotline: transitPoint.hotline,
      type: transitPoint.type,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTransitPoint = () => {
    if (!currentTransitPoint) return

    const updatedTransitPoints = transitPoints.map((point) =>
      point.id === currentTransitPoint.id
        ? {
            ...point,
            ...formData,
            lastModifiedAt: new Date().toISOString(),
          }
        : point,
    )

    setTransitPoints(updatedTransitPoints)
    setIsEditDialogOpen(false)
    resetForm()
    toast({
      title: "Transit Point Updated",
      description: `${formData.name} has been updated successfully.`,
    })
  }

  const handleDeleteClick = (transitPoint: TransitPoint) => {
    setCurrentTransitPoint(transitPoint)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTransitPoint = () => {
    if (!currentTransitPoint) return

    const updatedTransitPoints = transitPoints.filter((point) => point.id !== currentTransitPoint.id)
    setTransitPoints(updatedTransitPoints)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Transit Point Deleted",
      description: `${currentTransitPoint.name} has been deleted successfully.`,
      variant: "destructive",
    })
  }

  const getTypeIcon = (type: TransitPointType) => {
    switch (type) {
      case "PLACE":
        return <MapPin className="h-4 w-4" />
      case "STATION":
        return <Building className="h-4 w-4" />
      case "OFFICE":
        return <Building className="h-4 w-4" />
      case "TRANSPORT":
        return <MapPin className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Transit Points</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transit Point
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Transit Point</DialogTitle>
                <DialogDescription>Enter the details for the new transit point.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Central Bus Station"
                    className="col-span-3"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="e.g. 123 Main St, New York, NY"
                    className="col-span-3"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hotline" className="text-right">
                    Hotline
                  </Label>
                  <Input
                    id="hotline"
                    name="hotline"
                    placeholder="e.g. +1 (555) 123-4567"
                    className="col-span-3"
                    value={formData.hotline}
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
                      <SelectItem value="PLACE">Place</SelectItem>
                      <SelectItem value="STATION">Station</SelectItem>
                      <SelectItem value="OFFICE">Office</SelectItem>
                      <SelectItem value="TRANSPORT">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransitPoint}>Add Transit Point</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transit Points</CardTitle>
            <CardDescription>Manage all transit points in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transit points..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PLACE">Place</SelectItem>
                  <SelectItem value="STATION">Station</SelectItem>
                  <SelectItem value="OFFICE">Office</SelectItem>
                  <SelectItem value="TRANSPORT">Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Hotline</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransitPoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No transit points found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransitPoints.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="font-medium">{point.id}</TableCell>
                        <TableCell>{point.name}</TableCell>
                        <TableCell>{point.address}</TableCell>
                        <TableCell>{point.hotline}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(point.type)}
                            <span>{point.type}</span>
                          </div>
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditClick(point)}>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(point)} className="text-destructive">
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
            <DialogTitle>Edit Transit Point</DialogTitle>
            <DialogDescription>Update the details for this transit point.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                className="col-span-3"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <Input
                id="edit-address"
                name="address"
                className="col-span-3"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-hotline" className="text-right">
                Hotline
              </Label>
              <Input
                id="edit-hotline"
                name="hotline"
                className="col-span-3"
                value={formData.hotline}
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
                  <SelectItem value="PLACE">Place</SelectItem>
                  <SelectItem value="STATION">Station</SelectItem>
                  <SelectItem value="OFFICE">Office</SelectItem>
                  <SelectItem value="TRANSPORT">Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTransitPoint}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the transit point "{currentTransitPoint?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTransitPoint}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </DashboardLayout>
  )
}
