"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ArrowLeft, GripVertical, Plus, Trash2, Clock } from "lucide-react"
import Link from "next/link"

// Transit point type enum
type TransitPointType = "PLACE" | "STATION" | "OFFICE" | "TRANSPORT"

// Transit point interface
interface TransitPoint {
  id: string
  name: string
  address: string
  hotline: string
  type: TransitPointType
}

// Trip transit interface
interface TripTransit {
  id: string
  tripId: string
  transitPointId: string
  transitPoint: TransitPoint
  arrivalTime: string
  transitOrder: number
  type: "PICKUP" | "DROPOFF" | "STOP"
}

// Sample transit points data
const transitPointsData: TransitPoint[] = [
  {
    id: "tp-001",
    name: "Central Bus Station",
    address: "123 Main St, New York, NY",
    hotline: "+1 (555) 123-4567",
    type: "STATION",
  },
  {
    id: "tp-002",
    name: "Downtown Office",
    address: "456 Broadway, New York, NY",
    hotline: "+1 (555) 234-5678",
    type: "OFFICE",
  },
  {
    id: "tp-003",
    name: "Airport Terminal",
    address: "JFK Airport, Queens, NY",
    hotline: "+1 (555) 345-6789",
    type: "TRANSPORT",
  },
  {
    id: "tp-004",
    name: "Shopping Mall",
    address: "789 5th Ave, New York, NY",
    hotline: "+1 (555) 456-7890",
    type: "PLACE",
  },
  {
    id: "tp-005",
    name: "University Campus",
    address: "100 University Dr, Boston, MA",
    hotline: "+1 (555) 567-8901",
    type: "PLACE",
  },
]

// Sample trip data
const tripData = {
  id: "trip-001",
  code: "NYC-BOS",
  name: "New York to Boston Express",
  description: "Direct express service from NYC to Boston",
  status: "ACTIVE",
}

// Sample trip transits data
const tripTransitsData: TripTransit[] = [
  {
    id: "tt-001",
    tripId: "trip-001",
    transitPointId: "tp-001",
    transitPoint: transitPointsData[0],
    arrivalTime: "08:00",
    transitOrder: 0,
    type: "PICKUP",
  },
  {
    id: "tt-002",
    tripId: "trip-001",
    transitPointId: "tp-004",
    transitPoint: transitPointsData[3],
    arrivalTime: "08:30",
    transitOrder: 1,
    type: "STOP",
  },
  {
    id: "tt-003",
    tripId: "trip-001",
    transitPointId: "tp-005",
    transitPoint: transitPointsData[4],
    arrivalTime: "12:00",
    transitOrder: 2,
    type: "DROPOFF",
  },
]

export default function TripTransitsPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState(tripData)
  const [tripTransits, setTripTransits] = useState<TripTransit[]>(tripTransitsData)
  const [availableTransitPoints, setAvailableTransitPoints] = useState<TransitPoint[]>(transitPointsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    transitPointId: "",
    arrivalTime: "",
    type: "PICKUP" as "PICKUP" | "DROPOFF" | "STOP",
  })

  // Filter out transit points that are already in the trip
  useEffect(() => {
    const usedTransitPointIds = tripTransits.map((transit) => transit.transitPointId)
    const filteredTransitPoints = transitPointsData.filter((point) => !usedTransitPointIds.includes(point.id))
    setAvailableTransitPoints(filteredTransitPoints)
  }, [tripTransits])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTransitPointChange = (value: string) => {
    setFormData({
      ...formData,
      transitPointId: value,
    })
  }

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as "PICKUP" | "DROPOFF" | "STOP",
    })
  }

  const resetForm = () => {
    setFormData({
      transitPointId: "",
      arrivalTime: "",
      type: "PICKUP",
    })
  }

  const handleAddTransit = () => {
    const selectedTransitPoint = availableTransitPoints.find((point) => point.id === formData.transitPointId)
    if (!selectedTransitPoint) return

    const newTransit: TripTransit = {
      id: `tt-${String(tripTransits.length + 1).padStart(3, "0")}`,
      tripId,
      transitPointId: formData.transitPointId,
      transitPoint: selectedTransitPoint,
      arrivalTime: formData.arrivalTime,
      transitOrder: tripTransits.length,
      type: formData.type,
    }

    setTripTransits([...tripTransits, newTransit])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Transit Point Added",
      description: `${selectedTransitPoint.name} has been added to the trip.`,
    })
  }

  const handleDeleteTransit = (transitId: string) => {
    const updatedTransits = tripTransits
      .filter((transit) => transit.id !== transitId)
      .map((transit, index) => ({
        ...transit,
        transitOrder: index,
      }))

    setTripTransits(updatedTransits)
    toast({
      title: "Transit Point Removed",
      description: "The transit point has been removed from the trip.",
      variant: "destructive",
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(tripTransits)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update transit order
    const updatedItems = items.map((item, index) => ({
      ...item,
      transitOrder: index,
    }))

    setTripTransits(updatedItems)
    toast({
      title: "Transit Order Updated",
      description: "The transit order has been updated successfully.",
    })
  }

  const handleTimeChange = (transitId: string, time: string) => {
    const updatedTransits = tripTransits.map((transit) =>
      transit.id === transitId ? { ...transit, arrivalTime: time } : transit,
    )
    setTripTransits(updatedTransits)
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "PICKUP":
        return <Badge className="bg-green-500">Pickup</Badge>
      case "DROPOFF":
        return <Badge className="bg-blue-500">Dropoff</Badge>
      case "STOP":
        return <Badge variant="outline">Stop</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Trip Transit Points</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transit Point
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Transit Point</DialogTitle>
                <DialogDescription>Add a transit point to this trip.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transitPoint" className="text-right">
                    Transit Point
                  </Label>
                  <Select value={formData.transitPointId} onValueChange={handleTransitPointChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select transit point" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTransitPoints.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No available transit points
                        </SelectItem>
                      ) : (
                        availableTransitPoints.map((point) => (
                          <SelectItem key={point.id} value={point.id}>
                            {point.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="arrivalTime" className="text-right">
                    Arrival Time
                  </Label>
                  <Input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="time"
                    className="col-span-3"
                    value={formData.arrivalTime}
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
                      <SelectItem value="PICKUP">Pickup</SelectItem>
                      <SelectItem value="DROPOFF">Dropoff</SelectItem>
                      <SelectItem value="STOP">Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransit} disabled={!formData.transitPointId || !formData.arrivalTime}>
                  Add Transit Point
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
              <h3 className="text-lg font-medium">Transit Schedule</h3>
              <p className="text-sm text-muted-foreground">Drag and drop to reorder transit points.</p>
            </div>

            {tripTransits.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">No transit points added to this trip yet.</p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transit Point
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="transitPoints">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {tripTransits.map((transit, index) => (
                        <Draggable key={transit.id} draggableId={transit.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between p-3 border rounded-md bg-card"
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="cursor-grab">
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="font-medium">{transit.transitPoint.name}</div>
                                  <div className="text-sm text-muted-foreground">{transit.transitPoint.address}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="time"
                                    value={transit.arrivalTime}
                                    onChange={(e) => handleTimeChange(transit.id, e.target.value)}
                                    className="w-[120px]"
                                  />
                                </div>
                                <div>{getTypeBadge(transit.type)}</div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTransit(transit.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </DashboardLayout>
  )
}
