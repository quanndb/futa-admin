"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import api from "@/lib/axios"

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

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  })

  // Fetch trips on component mount
  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/trips")
      setTrips(response.data)
    } catch (error) {
      console.error("Error fetching trips:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleAddTrip = async () => {
    try {
      setIsLoading(true)
      const response = await api.post("/trips", formData)
      setTrips([...trips, response.data])
      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: `Đã thêm chuyến đi ${formData.name}.`,
      })
    } catch (error) {
      console.error("Error adding trip:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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

  const handleUpdateTrip = async () => {
    if (!currentTrip) return

    try {
      setIsLoading(true)
      const response = await api.put(`/trips/${currentTrip.id}`, formData)

      const updatedTrips = trips.map((trip) => (trip.id === currentTrip.id ? response.data : trip))

      setTrips(updatedTrips)
      setIsEditDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: `Đã cập nhật chuyến đi ${formData.name}.`,
      })
    } catch (error) {
      console.error("Error updating trip:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật chuyến đi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (trip: Trip) => {
    setCurrentTrip(trip)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTrip = async () => {
    if (!currentTrip) return

    try {
      setIsLoading(true)
      await api.delete(`/trips/${currentTrip.id}`)

      const updatedTrips = trips.filter((trip) => trip.id !== currentTrip.id)
      setTrips(updatedTrips)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Thành công",
        description: `Đã xóa chuyến đi ${currentTrip.name}.`,
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting trip:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa chuyến đi. Vui lòng thử lại sau.",
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Chuyến Đi</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Chuyến Đi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm Chuyến Đi Mới</DialogTitle>
                <DialogDescription>Nhập thông tin cho chuyến đi mới.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="code" className="text-right">
                    Mã
                  </label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="VD: HN-SG"
                    className="col-span-3"
                    value={formData.code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Tên
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="VD: Hà Nội đến Sài Gòn"
                    className="col-span-3"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">
                    Mô tả
                  </label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="VD: Dịch vụ trực tiếp"
                    className="col-span-3"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="status" className="text-right">
                    Trạng thái
                  </label>
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
                <Button onClick={handleAddTrip} disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Thêm Chuyến Đi"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tất Cả Chuyến Đi</CardTitle>
            <CardDescription>Quản lý tất cả các chuyến đi trong hệ thống.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm chuyến đi..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mã</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Điểm Trung Chuyển</TableHead>
                    <TableHead>Chi Tiết Chuyến</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Đang tải dữ liệu...
                      </TableCell>
                    </TableRow>
                  ) : filteredTrips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Không tìm thấy chuyến đi nào
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
                            <span>{trip.transitCount} điểm</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/trips/${trip.id}/details`} className="flex items-center hover:underline">
                            <span>{trip.detailsCount} chi tiết</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(trip.status)}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditClick(trip)}>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(trip)} className="text-destructive">
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
            <DialogTitle>Chỉnh Sửa Chuyến Đi</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho chuyến đi này.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-code" className="text-right">
                Mã
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
                Tên
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
                Mô tả
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
                Trạng thái
              </label>
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
            <Button onClick={handleUpdateTrip} disabled={isLoading}>
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
              Bạn có chắc chắn muốn xóa chuyến đi "{currentTrip?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrip} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </DashboardLayout>
  )
}
