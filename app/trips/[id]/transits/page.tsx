"use client"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ArrowLeft, GripVertical, Plus, Trash2, Clock } from "lucide-react"
import Link from "next/link"
import api from "@/lib/axios"

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

// Trip interface
interface Trip {
  id: string
  code: string
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE"
}

export default function TripTransitsPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState<Trip | null>(null)
  const [tripTransits, setTripTransits] = useState<TripTransit[]>([])
  const [availableTransitPoints, setAvailableTransitPoints] = useState<TransitPoint[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    transitPointId: "",
    arrivalTime: "",
    type: "PICKUP" as "PICKUP" | "DROPOFF" | "STOP",
  })

  // Fetch trip and transit points on component mount
  useEffect(() => {
    fetchTrip()
    fetchTripTransits()
    fetchAvailableTransitPoints()
  }, [tripId])

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${tripId}`)
      setTrip(response.data)
    } catch (error) {
      console.error("Error fetching trip:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const fetchTripTransits = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/trips/${tripId}/transits`)
      setTripTransits(response.data)
    } catch (error) {
      console.error("Error fetching trip transits:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách điểm trung chuyển của chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableTransitPoints = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/available-transit-points`)
      setAvailableTransitPoints(response.data)
    } catch (error) {
      console.error("Error fetching available transit points:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách điểm trung chuyển khả dụng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

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

  const handleAddTransit = async () => {
    try {
      setIsLoading(true)
      const payload = {
        transitPointId: formData.transitPointId,
        arrivalTime: formData.arrivalTime,
        type: formData.type,
        transitOrder: tripTransits.length,
      }

      const response = await api.post(`/trips/${tripId}/transits`, payload)

      // Refresh the transit points list
      await fetchTripTransits()
      await fetchAvailableTransitPoints()

      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: "Đã thêm điểm trung chuyển vào chuyến đi.",
      })
    } catch (error) {
      console.error("Error adding transit point:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm điểm trung chuyển. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTransit = async (transitId: string) => {
    try {
      setIsLoading(true)
      await api.delete(`/trips/${tripId}/transits/${transitId}`)

      // Refresh the transit points list
      await fetchTripTransits()
      await fetchAvailableTransitPoints()

      toast({
        title: "Thành công",
        description: "Đã xóa điểm trung chuyển khỏi chuyến đi.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting transit point:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa điểm trung chuyển. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = async (result: any) => {
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

    try {
      // Send the updated order to the server
      await api.put(`/trips/${tripId}/transits/reorder`, {
        transitOrders: updatedItems.map((item) => ({
          id: item.id,
          order: item.transitOrder,
        })),
      })

      toast({
        title: "Thành công",
        description: "Đã cập nhật thứ tự điểm trung chuyển.",
      })
    } catch (error) {
      console.error("Error updating transit order:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thứ tự điểm trung chuyển. Vui lòng thử lại sau.",
        variant: "destructive",
      })
      // Revert to the original order by refetching
      fetchTripTransits()
    }
  }

  const handleTimeChange = async (transitId: string, time: string) => {
    try {
      await api.put(`/trips/${tripId}/transits/${transitId}`, {
        arrivalTime: time,
      })

      // Update local state
      const updatedTransits = tripTransits.map((transit) =>
        transit.id === transitId ? { ...transit, arrivalTime: time } : transit,
      )
      setTripTransits(updatedTransits)
    } catch (error) {
      console.error("Error updating arrival time:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thời gian đến. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "PICKUP":
        return <Badge className="bg-green-500">Đón khách</Badge>
      case "DROPOFF":
        return <Badge className="bg-blue-500">Trả khách</Badge>
      case "STOP":
        return <Badge variant="outline">Điểm dừng</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PICKUP":
        return "Đón khách"
      case "DROPOFF":
        return "Trả khách"
      case "STOP":
        return "Điểm dừng"
      default:
        return type
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
            <h1 className="text-3xl font-bold tracking-tight">Điểm Trung Chuyển Của Chuyến Đi</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Điểm Trung Chuyển
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm Điểm Trung Chuyển</DialogTitle>
                <DialogDescription>Thêm điểm trung chuyển vào chuyến đi này.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transitPoint" className="text-right">
                    Điểm Trung Chuyển
                  </Label>
                  <Select value={formData.transitPointId} onValueChange={handleTransitPointChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn điểm trung chuyển" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTransitPoints.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Không có điểm trung chuyển khả dụng
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
                    Thời Gian Đến
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
                    Loại
                  </Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PICKUP">Đón khách</SelectItem>
                      <SelectItem value="DROPOFF">Trả khách</SelectItem>
                      <SelectItem value="STOP">Điểm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleAddTransit}
                  disabled={isLoading || !formData.transitPointId || !formData.arrivalTime}
                >
                  {isLoading ? "Đang xử lý..." : "Thêm Điểm Trung Chuyển"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{trip?.name || "Đang tải..."}</CardTitle>
            <CardDescription>
              Mã: {trip?.code || "..."} | Trạng thái: {trip?.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Lịch Trình Chuyến Đi</h3>
              <p className="text-sm text-muted-foreground">Kéo và thả để sắp xếp lại thứ tự điểm trung chuyển.</p>
            </div>

            {isLoading ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
              </div>
            ) : tripTransits.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">Chưa có điểm trung chuyển nào được thêm vào chuyến đi này.</p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Điểm Trung Chuyển
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
