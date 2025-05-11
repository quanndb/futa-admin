"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import api from "@/lib/axios"

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

// Trip interface
interface Trip {
  id: string
  code: string
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE"
}

export default function TripDetailsPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState<Trip | null>(null)
  const [tripDetails, setTripDetails] = useState<TripDetail[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTripDetail, setCurrentTripDetail] = useState<TripDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    type: "SEAT" as "SEAT" | "BED" | "VIP",
    price: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  })

  // Fetch trip and trip details on component mount
  useEffect(() => {
    fetchTrip()
    fetchTripDetails()
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

  const fetchTripDetails = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/trips/${tripId}/details`)
      setTripDetails(response.data)
    } catch (error) {
      console.error("Error fetching trip details:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải chi tiết chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleAddTripDetail = async () => {
    try {
      setIsLoading(true)
      const payload = {
        tripId,
        tripCode: trip?.code,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        type: formData.type,
        price: Number.parseFloat(formData.price),
        status: formData.status,
      }

      const response = await api.post(`/trips/${tripId}/details`, payload)

      // Refresh the trip details list
      await fetchTripDetails()

      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: `Đã thêm chi tiết chuyến đi cho loại ${getTypeLabel(formData.type)}.`,
      })
    } catch (error) {
      console.error("Error adding trip detail:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm chi tiết chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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

  const handleUpdateTripDetail = async () => {
    if (!currentTripDetail) return

    try {
      setIsLoading(true)
      const payload = {
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        type: formData.type,
        price: Number.parseFloat(formData.price),
        status: formData.status,
      }

      const response = await api.put(`/trips/${tripId}/details/${currentTripDetail.id}`, payload)

      // Refresh the trip details list
      await fetchTripDetails()

      setIsEditDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: `Đã cập nhật chi tiết chuyến đi cho loại ${getTypeLabel(formData.type)}.`,
      })
    } catch (error) {
      console.error("Error updating trip detail:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật chi tiết chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (tripDetail: TripDetail) => {
    setCurrentTripDetail(tripDetail)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTripDetail = async () => {
    if (!currentTripDetail) return

    try {
      setIsLoading(true)
      await api.delete(`/trips/${tripId}/details/${currentTripDetail.id}`)

      // Refresh the trip details list
      await fetchTripDetails()

      setIsDeleteDialogOpen(false)
      toast({
        title: "Thành công",
        description: "Đã xóa chi tiết chuyến đi.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting trip detail:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa chi tiết chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Hoạt động</Badge>
      case "INACTIVE":
        return <Badge variant="outline">Không hoạt động</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "SEAT":
        return "Ghế thường"
      case "BED":
        return "Giường nằm"
      case "VIP":
        return "Dịch vụ VIP"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
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
            <h1 className="text-3xl font-bold tracking-tight">Chi Tiết Chuyến Đi</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Chi Tiết Chuyến Đi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm Chi Tiết Chuyến Đi</DialogTitle>
                <DialogDescription>Nhập thông tin cho lịch trình chuyến đi này.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fromDate" className="text-right">
                    Từ Ngày
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
                    Đến Ngày
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
                    Loại
                  </Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEAT">Ghế thường</SelectItem>
                      <SelectItem value="BED">Giường nằm</SelectItem>
                      <SelectItem value="VIP">Dịch vụ VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Giá (VNĐ)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="1000"
                    placeholder="0"
                    className="col-span-3"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Trạng thái
                  </Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleAddTripDetail}
                  disabled={isLoading || !formData.fromDate || !formData.toDate || !formData.price}
                >
                  {isLoading ? "Đang xử lý..." : "Thêm Chi Tiết"}
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
              <h3 className="text-lg font-medium">Lịch Trình và Giá Vé</h3>
              <p className="text-sm text-muted-foreground">Quản lý lịch trình và giá vé cho chuyến đi này.</p>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Khoảng Thời Gian</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Đang tải dữ liệu...
                      </TableCell>
                    </TableRow>
                  ) : tripDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Không tìm thấy chi tiết chuyến đi nào
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
                        <TableCell>{detail.price.toLocaleString("vi-VN")} VNĐ</TableCell>
                        <TableCell>{getStatusBadge(detail.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditClick(detail)}>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(detail)} className="text-destructive">
                                Xóa
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
            <DialogTitle>Chỉnh Sửa Chi Tiết Chuyến Đi</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho lịch trình chuyến đi này.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-fromDate" className="text-right">
                Từ Ngày
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
                Đến Ngày
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
                Loại
              </Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEAT">Ghế thường</SelectItem>
                  <SelectItem value="BED">Giường nằm</SelectItem>
                  <SelectItem value="VIP">Dịch vụ VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Giá (VNĐ)
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="1000"
                className="col-span-3"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Trạng thái
              </Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateTripDetail} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Lưu Thay Đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chi tiết chuyến đi này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTripDetail} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </DashboardLayout>
  )
}
