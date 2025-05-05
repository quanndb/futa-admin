"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, Calendar, User, DollarSign, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Sample withdrawal data
const withdrawalsData = [
  {
    id: "WD-001",
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    amount: 150.0,
    bankAccount: "XXXX-XXXX-XXXX-1234",
    requestDate: "2024-05-01T10:23:45",
    status: "pending",
    notes: "",
  },
  {
    id: "WD-002",
    customerName: "Emily Johnson",
    customerEmail: "emily.j@example.com",
    amount: 75.5,
    bankAccount: "XXXX-XXXX-XXXX-5678",
    requestDate: "2024-05-02T14:15:22",
    status: "approved",
    notes: "Processed on May 3rd",
  },
  {
    id: "WD-003",
    customerName: "Michael Brown",
    customerEmail: "mbrown@example.com",
    amount: 200.0,
    bankAccount: "XXXX-XXXX-XXXX-9012",
    requestDate: "2024-05-03T09:45:10",
    status: "rejected",
    notes: "Invalid bank account information",
  },
  {
    id: "WD-004",
    customerName: "Sarah Wilson",
    customerEmail: "swilson@example.com",
    amount: 120.75,
    bankAccount: "XXXX-XXXX-XXXX-3456",
    requestDate: "2024-05-04T16:32:18",
    status: "pending",
    notes: "",
  },
  {
    id: "WD-005",
    customerName: "David Lee",
    customerEmail: "dlee@example.com",
    amount: 350.25,
    bankAccount: "XXXX-XXXX-XXXX-7890",
    requestDate: "2024-05-05T11:20:33",
    status: "approved",
    notes: "Processed on May 6th",
  },
]

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState(withdrawalsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [processingNote, setProcessingNote] = useState("")

  // Filter withdrawals based on search query and status filter
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const viewWithdrawalDetails = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal)
    setProcessingNote(withdrawal.notes)
    setIsDetailsDialogOpen(true)
  }

  const handleApproveWithdrawal = () => {
    const updatedWithdrawals = withdrawals.map((w) =>
      w.id === selectedWithdrawal.id ? { ...w, status: "approved", notes: processingNote } : w,
    )
    setWithdrawals(updatedWithdrawals)
    setIsDetailsDialogOpen(false)
    toast({
      title: "Withdrawal Approved",
      description: `Withdrawal ${selectedWithdrawal.id} has been approved.`,
    })
  }

  const handleRejectWithdrawal = () => {
    const updatedWithdrawals = withdrawals.map((w) =>
      w.id === selectedWithdrawal.id ? { ...w, status: "rejected", notes: processingNote } : w,
    )
    setWithdrawals(updatedWithdrawals)
    setIsDetailsDialogOpen(false)
    toast({
      title: "Withdrawal Rejected",
      description: `Withdrawal ${selectedWithdrawal.id} has been rejected.`,
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Withdrawal Requests</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Withdrawal Requests</CardTitle>
            <CardDescription>View and manage customer withdrawal requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search withdrawals..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Bank Account</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No withdrawal requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWithdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">{withdrawal.id}</TableCell>
                        <TableCell>{withdrawal.customerName}</TableCell>
                        <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                        <TableCell>{withdrawal.bankAccount}</TableCell>
                        <TableCell>{formatDate(withdrawal.requestDate)}</TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
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
                              <DropdownMenuItem onClick={() => viewWithdrawalDetails(withdrawal)}>
                                View Details
                              </DropdownMenuItem>
                              {withdrawal.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => viewWithdrawalDetails(withdrawal)}>
                                    Process Request
                                  </DropdownMenuItem>
                                </>
                              )}
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

        {/* Withdrawal Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Withdrawal Request Details</DialogTitle>
              <DialogDescription>Complete information about the withdrawal request.</DialogDescription>
            </DialogHeader>
            {selectedWithdrawal && (
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
                        <p className="font-medium">{selectedWithdrawal.customerName}</p>
                        <p className="text-muted-foreground">{selectedWithdrawal.customerEmail}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Request Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">ID:</span> {selectedWithdrawal.id}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> {formatDate(selectedWithdrawal.requestDate)}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span> {selectedWithdrawal.status}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Withdrawal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <span className="font-medium">Amount:</span> ${selectedWithdrawal.amount.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-medium">Bank Account:</span> {selectedWithdrawal.bankAccount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedWithdrawal.status === "pending" && (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Processing Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about this withdrawal request"
                      value={processingNote}
                      onChange={(e) => setProcessingNote(e.target.value)}
                    />
                  </div>
                )}

                <DialogFooter>
                  {selectedWithdrawal.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <Button variant="destructive" onClick={handleRejectWithdrawal}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button onClick={handleApproveWithdrawal}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </DashboardLayout>
  )
}
