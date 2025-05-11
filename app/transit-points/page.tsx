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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, Search, MapPin, Building, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TransitPointService, type TransitPoint, type PageResponse } from "@/services"

export default function TransitPointsPage() {
  const [transitPointsPage, setTransitPointsPage] = useState<PageResponse<TransitPoint>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    hasNext: false,
    hasPrevious: false,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTransitPoint, setCurrentTransitPoint] = useState<TransitPoint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    hotline: "",
    type: "PLACE" as "PLACE" | "STATION" | "OFFICE" | "TRANSPORT",
  })
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Fetch transit points on component mount or when pagination/filters change
  useEffect(() => {
    fetchTransitPoints()
  }, [pageIndex, pageSize, typeFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransitPoints()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchTransitPoints = async () => {
    setIsLoading(true)
    try {
      const pageRequest = {
        pageIndex,
        pageSize,
        keyword: searchQuery,
        ids: [],
        excludeIds: [],
      }

      // Add type filter if not "all"
      if (typeFilter !== "all") {
        // This is just an example - your API might handle type filtering differently
        pageRequest.keyword = `${pageRequest.keyword || ""} type:${typeFilter}`.trim()
      }

      const data = await TransitPointService.getPage(pageRequest)
      setTransitPointsPage(data)
    } catch (error) {
      console.error("Error fetching transit points:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách điểm trung chuyển. Vui lòng thử lại sau.",
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
      type: value as "PLACE" | "STATION" | "OFFICE" | "TRANSPORT",
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

  const handleAddTransitPoint = async () => {
    try {
      setIsLoading(true)
      const newTransitPoint = await TransitPointService.create(formData)

      // Refresh the list
      fetchTransitPoints()

      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: `Đã thêm điểm trung chuyển ${formData.name}.`,
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

  const handleUpdateTransitPoint = async () => {
    if (!currentTransitPoint) return

    try {
      setIsLoading(true)
      await TransitPointService.update(currentTransitPoint.id, formData)

      // Refresh the list
      fetchTransitPoints()

      setIsEditDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: `Đã cập nhật điểm trung chuyển ${formData.name}.`,
      })
    } catch (error) {
      console.error("Error updating transit point:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật điểm trung chuyển. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (transitPoint: TransitPoint) => {
    setCurrentTransitPoint(transitPoint)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTransitPoint = async () => {
    if (!currentTransitPoint) return

    try {
      setIsLoading(true)
      await TransitPointService.delete(currentTransitPoint.id)

      // Refresh the list
      fetchTransitPoints()

      setIsDeleteDialogOpen(false)
      toast({
        title: "Thành công",
        description: `Đã xóa điểm trung chuyển ${currentTransitPoint.name}.`,
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

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex)
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setPageIndex(0) // Reset to first page when changing page size
  }

  const getTypeIcon = (type: string) => {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PLACE":
        return "Địa điểm"
      case "STATION":
        return "Trạm"
      case "OFFICE":
        return "Văn phòng"
      case "TRANSPORT":
        return "Giao thông"
      default:
        return type
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Điểm Trung Chuyển</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Điểm Trung Chuyển
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm Điểm Trung Chuyển Mới</DialogTitle>
                <DialogDescription>Nhập thông tin cho điểm trung chuyển mới.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="VD: Bến xe trung tâm"
                    className="col-span-3"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="VD: 123 Đường Lê Lợi, Quận 1, TP.HCM"
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
                    placeholder="VD: 028 1234 5678"
                    className="col-span-3"
                    value={formData.hotline}
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
                      <SelectItem value="PLACE">Địa điểm</SelectItem>
                      <SelectItem value="STATION">Trạm</SelectItem>
                      <SelectItem value="OFFICE">Văn phòng</SelectItem>
                      <SelectItem value="TRANSPORT">Giao thông</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddTransitPoint} disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Thêm Điểm Trung Chuyển"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tất Cả Điểm Trung Chuyển</CardTitle>
            <CardDescription>Quản lý tất cả các điểm trung chuyển trong hệ thống.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm điểm trung chuyển..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Lọc theo loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="PLACE">Địa điểm</SelectItem>
                    <SelectItem value="STATION">Trạm</SelectItem>
                    <SelectItem value="OFFICE">Văn phòng</SelectItem>
                    <SelectItem value="TRANSPORT">Giao thông</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Số lượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Hotline</TableHead>
                    <TableHead>Loại</TableHead>
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
                  ) : transitPointsPage.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Không tìm thấy điểm trung chuyển nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    transitPointsPage.items.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="font-medium">{point.id}</TableCell>
                        <TableCell>{point.name}</TableCell>
                        <TableCell>{point.address}</TableCell>
                        <TableCell>{point.hotline}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(point.type)}
                            <span>{getTypeLabel(point.type)}</span>
                          </div>
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditClick(point)}>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(point)} className="text-destructive">
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {transitPointsPage.items.length} / {transitPointsPage.totalItems} điểm trung chuyển
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pageIndex - 1)}
                  disabled={!transitPointsPage.hasPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Trang {transitPointsPage.currentPage + 1} / {transitPointsPage.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pageIndex + 1)}
                  disabled={!transitPointsPage.hasNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Điểm Trung Chuyển</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho điểm trung chuyển này.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Tên
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
                Địa chỉ
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
                Loại
              </Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLACE">Địa điểm</SelectItem>
                  <SelectItem value="STATION">Trạm</SelectItem>
                  <SelectItem value="OFFICE">Văn phòng</SelectItem>
                  <SelectItem value="TRANSPORT">Giao thông</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateTransitPoint} disabled={isLoading}>
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
              Bạn có chắc chắn muốn xóa điểm trung chuyển "{currentTransitPoint?.name}"? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTransitPoint} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </DashboardLayout>
  )
}
