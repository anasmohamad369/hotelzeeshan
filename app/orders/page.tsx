"use client"

import { useEffect, useState, useMemo } from "react"
import Nav from "@/components/nav"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, Truck, Loader2, Search } from "lucide-react"

interface OrderItem {
  name: string
  qty: number
  price: number
  _id: string
}

interface Order {
  _id: string
  token: string
  items: OrderItem[]
  total: number
  date: string
  __v: number
}

type StatusKey = 'preparing' | 'delivering' | 'delivered'

const statusConfig = {
  preparing: { label: "Preparing", color: "bg-amber-500", icon: Clock },
  delivering: { label: "On the way", color: "bg-blue-500", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500", icon: CheckCircle },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  if (orderDate.getTime() === today.getTime()) {
    return `Today, ${timeStr}`
  } else if (orderDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeStr}`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + `, ${timeStr}`
  }
}

function getOrderStatus(orderDate: Date): StatusKey {
  const hoursSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60)

  if (hoursSinceOrder < 1) {
    return 'preparing'
  } else if (hoursSinceOrder < 2) {
    return 'delivering'
  }
  return 'delivered'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const url = `http://localhost:3001/orders${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        setOrders(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders')
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [startDate, endDate])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        order.token.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))

      if (!matchesSearch) return false

      // Status filter
      if (statusFilter !== "all") {
        const orderStatus = getOrderStatus(new Date(order.date))
        if (orderStatus !== statusFilter) return false
      }

      // Date filter
      if (dateFilter !== "all") {
        const orderDate = new Date(order.date)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const last7Days = new Date(today)
        last7Days.setDate(last7Days.getDate() - 7)

        const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate())

        if (dateFilter === "today" && orderDateOnly.getTime() !== today.getTime()) {
          return false
        }
        if (dateFilter === "yesterday" && orderDateOnly.getTime() !== yesterday.getTime()) {
          return false
        }
        if (dateFilter === "last7days" && orderDate.getTime() < last7Days.getTime()) {
          return false
        }
      }

      return true
    })
  }, [orders, searchQuery, statusFilter, dateFilter])

  const totalCost = filteredOrders.reduce((total, order) => total + order.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
  onClick={() => {
    setSearchQuery("")
    setStatusFilter("all")
    setDateFilter("all")
    setStartDate("")
    setEndDate("")
  }}
  className="text-sm text-primary underline"
>
  Clear Filters
</button>
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by token or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-[150px]"
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-[150px]"
              placeholder="End Date"
            />
          </div>


        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading orders</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No orders match your search</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Token</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right w-[120px]">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const orderStatus = getOrderStatus(new Date(order.date))
                      const status = statusConfig[orderStatus]
                      const StatusIcon = status.icon

                      return (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">#{order.token}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(order.date)}
                          </TableCell>
                          <TableCell>
                            <ul className="space-y-1">
                              {order.items.map((item) => (
                                <li key={item._id} className="text-sm">
                                  {item.name}
                                  <span className="text-muted-foreground"> ×{item.qty}</span>
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell className="text-right font-bold">₹{order.total}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{filteredOrders.length}</p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalCost.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Date Range</p>
                <p className="font-medium">
                  {startDate || endDate
                    ? `${startDate || "—"} → ${endDate || "—"}`
                    : "All Time"}
                </p>
              </div>
            </div>
            {/* Results count */}
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </>
        )}
      </main>
    </div>
  )
}
