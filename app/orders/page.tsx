"use client"

import { useEffect, useState, useMemo } from "react"
import Nav from "@/components/nav"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { menuData, categories, type MenuItem } from "@/lib/menu-data"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, Truck, Loader2, Search, Trash2, Edit, Plus, Minus, ShoppingBag } from "lucide-react"

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
  totalAmount?: number
  discount?: number
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const url = `https://hotelzeeshanbackend.vercel.app/orders${params.toString() ? `?${params.toString()}` : ''}`
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

  const totalCost = filteredOrders.reduce((total, order) => total + (order.totalAmount || order.total), 0)

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return

    setIsDeleting(true)
    try {
      // const response = await fetch("http://localhost:3001/delete-order", {
      const response = await fetch("https://hotelzeeshanbackend.vercel.app/delete-order", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderToDelete._id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete order")
      }

      // Remove the order from the list
      setOrders((prev) => prev.filter((order) => order._id !== orderToDelete._id))

      toast({
        title: "Order Deleted",
        description: `Order #${orderToDelete.token} has been deleted successfully.`,
        variant: "default",
      })

      setDeleteDialogOpen(false)
      setOrderToDelete(null)
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateClick = (order: Order) => {
    setOrderToUpdate(order)
    // Initialize selected items with current order items
    const itemsMap: Record<string, number> = {}
    order.items.forEach((item) => {
      itemsMap[item.name] = item.qty
    })
    setSelectedItems(itemsMap)
    setUpdateDialogOpen(true)
  }

  const handleItemQuantityChange = (itemName: string, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[itemName] || 0
      const newQuantity = Math.max(0, current + delta)
      if (newQuantity === 0) {
        const { [itemName]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [itemName]: newQuantity }
    })
  }

  const getItemPrice = (itemName: string): number => {
    // Search through all menu items to find the price
    for (const categoryItems of Object.values(menuData)) {
      for (const item of categoryItems) {
        if ("variants" in item && item.variants) {
          const variant = item.variants.find((v) => v.item === itemName)
          if (variant) return variant.price
        } else if (item.item === itemName && item.price) {
          return item.price
        }
      }
    }
    // If not found, try to get from current order
    if (orderToUpdate) {
      const existingItem = orderToUpdate.items.find((i) => i.name === itemName)
      if (existingItem) return existingItem.price
    }
    return 0
  }

  const calculateNewTotal = () => {
    let total = 0
    Object.entries(selectedItems).forEach(([itemName, qty]) => {
      total += getItemPrice(itemName) * qty
    })
    return total
  }

  const handleUpdateConfirm = async () => {
    if (!orderToUpdate) return

    setIsUpdating(true)
    try {
      // Convert selected items to order format
      const newItems = Object.entries(selectedItems).map(([name, qty]) => ({
        name,
        qty,
        price: getItemPrice(name),
      }))

      const newTotal = calculateNewTotal()
      const discount = orderToUpdate.discount || 0
      const discountAmount = (newTotal * discount) / 100
      const newTotalAmount = newTotal - discountAmount

      const orderData = {
        items: newItems,
        total: Math.round(newTotal),
        totalAmount: Math.round(newTotalAmount),
        discount: discount,
      }

      const response = await fetch("http://localhost:3001/update-order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderToUpdate._id,
          orderData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order")
      }

      // Refresh orders
      const ordersResponse = await fetch("https://hotelzeeshanbackend.vercel.app/orders")
      if (ordersResponse.ok) {
        const updatedOrders = await ordersResponse.json()
        setOrders(updatedOrders)
      }

      toast({
        title: "Order Updated",
        description: `Order #${orderToUpdate.token} has been updated successfully.`,
        variant: "default",
      })

      setUpdateDialogOpen(false)
      setOrderToUpdate(null)
      setSelectedItems({})
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Failed to update order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const addMenuItemToOrder = (menuItem: MenuItem, variantSlug?: string) => {
    let itemName: string
    let price: number

    if ("variants" in menuItem && menuItem.variants) {
      const variant = variantSlug
        ? menuItem.variants.find((v) => v.slug === variantSlug)
        : menuItem.variants[0]
      if (!variant) return
      itemName = variant.item
      price = variant.price
    } else {
      itemName = menuItem.item
      price = menuItem.price || 0
    }

    setSelectedItems((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }))
  }

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
                      <TableHead className="w-[80px] text-center">Actions</TableHead>
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
                          <TableCell className="text-right">
                            {order.discount && order.discount > 0 ? (
                              <div className="flex flex-col items-end gap-1">
                                <div className="text-sm text-muted-foreground line-through">
                                  ₹{order.total.toFixed(2)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                    -{order.discount}%
                                  </Badge>
                                  <span className="font-bold text-primary">
                                    ₹{(order.totalAmount || order.total).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="font-bold">₹{order.total.toFixed(2)}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => handleUpdateClick(order)}
                                title="Update Order"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteClick(order)}
                                title="Delete Order"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
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

        {/* Update Order Drawer */}
        <>
          {/* Overlay */}
          {updateDialogOpen && (
            <div
              className="fixed inset-0 bg-foreground/50 z-50 transition-opacity overflow-y-auto"
              onClick={() => setUpdateDialogOpen(false)}
            />
          )}

          <div
            className={`fixed right-0 top-0 h-full w-full max-w-6xl bg-card z-50 shadow-2xl transition-transform duration-300 ${
              updateDialogOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Edit className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Update Order #{orderToUpdate?.token}</h2>
                    <p className="text-sm text-muted-foreground">Add missed items or update quantities</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setUpdateDialogOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                  {/* Current Order Items - Left Sidebar */}
                  <div className="lg:col-span-1 flex flex-col border-r border-border bg-muted/20 min-h-0">
                    <div className="p-4 border-b border-border shrink-0">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-bold text-lg">Order Items</h3>
                          <p className="text-xs text-muted-foreground">
                            {Object.keys(selectedItems).length} item{Object.keys(selectedItems).length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 min-h-0">
                      <div className="p-4 space-y-3">
                        {Object.keys(selectedItems).length > 0 ? (
                          Object.entries(selectedItems).map(([itemName, qty]) => {
                            const price = getItemPrice(itemName)
                            return (
                              <div
                                key={itemName}
                                className="group relative p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm mb-1 line-clamp-2">{itemName}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>₹{price.toFixed(2)}</span>
                                      <span>×</span>
                                      <span className="font-medium text-foreground">{qty}</span>
                                      <span>=</span>
                                      <span className="font-bold text-primary">₹{(price * qty).toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-background rounded-lg p-1 border">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() => handleItemQuantityChange(itemName, -1)}
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-bold">{qty}</span>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                                      onClick={() => handleItemQuantityChange(itemName, 1)}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center py-12">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-sm text-muted-foreground">No items in order</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Menu Items - Right Side */}
                  <div className="lg:col-span-2 flex flex-col min-h-0">
                    <div className="p-4 border-b border-border shrink-0">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-bold text-lg">Add Items from Menu</h3>
                          <p className="text-xs text-muted-foreground">Browse and add items by category</p>
                        </div>
                      </div>
                    </div>
                    <Tabs defaultValue={categories[0]?.id} className="flex-1 flex  flex-col overflow-hidden min-h-2">
                      <div className="px-4 pt-4 shrink-0">
                        <TabsList className="grid grid-cols-4 gap-2 lg:grid-cols-7 w-full h-auto p-2 bg-muted/50">
                          {categories.map((category) => (
                            <TabsTrigger
                              key={category.id}
                              value={category.id}
                              className="text-xs sm:text-sm  data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                              {category.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                      <ScrollArea className="flex-1 min-h-0">
                        <div className="p-4">
                          {categories.map((category) => (
                            <TabsContent key={category.id} value={category.id} className="mt-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {menuData[category.id]?.map((menuItem) => {
                                  const isVariant = "variants" in menuItem && !!menuItem.variants

                                  if (isVariant) {
                                    return (
                                      <div
                                        key={menuItem.item}
                                        className="p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
                                      >
                                        <p className="font-semibold text-sm mb-3 line-clamp-2">{menuItem.item}</p>
                                        <div className="flex flex-col gap-2">
                                          {menuItem.variants!.map((variant) => (
                                            <Button
                                              key={variant.slug}
                                              size="sm"
                                              variant="outline"
                                              className="w-full justify-between hover:bg-primary hover:text-primary-foreground transition-colors"
                                              onClick={() => addMenuItemToOrder(menuItem, variant.slug)}
                                            >
                                              <span className="font-medium">{variant.size}</span>
                                              <span className="text-primary font-bold">₹{variant.price}</span>
                                            </Button>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  }

                                  return (
                                    <div
                                      key={menuItem.item}
                                      className="group p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm mb-1 line-clamp-2">{menuItem.item}</p>
                                          <p className="text-sm font-bold text-primary">₹{menuItem.price}</p>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="default"
                                          className="shrink-0"
                                          onClick={() => addMenuItemToOrder(menuItem)}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </TabsContent>
                          ))}
                        </div>
                      </ScrollArea>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border bg-muted/30 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subtotal:</span>
                      <span className="font-semibold text-base">₹{calculateNewTotal().toFixed(2)}</span>
                    </div>
                    {orderToUpdate?.discount && orderToUpdate.discount > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Discount ({orderToUpdate.discount}%):
                          </span>
                          <span className="text-red-500 font-semibold">
                            -₹{((calculateNewTotal() * orderToUpdate.discount) / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-lg font-bold">Total:</span>
                          <span className="text-2xl font-bold text-primary">
                            ₹{(calculateNewTotal() - (calculateNewTotal() * orderToUpdate.discount) / 100).toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                    {(!orderToUpdate?.discount || orderToUpdate.discount === 0) && (
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-primary">₹{calculateNewTotal().toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 sm:ml-4">
                    <Button
                      variant="outline"
                      onClick={() => setUpdateDialogOpen(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateConfirm} disabled={isUpdating} size="lg" className="min-w-[140px]">
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" />
                          Update Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Order</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete order #{orderToDelete?.token}? This action cannot be undone.
                {orderToDelete && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Order Details:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {orderToDelete.items.map((item) => (
                        <li key={item._id} className="text-muted-foreground">
                          {item.name} × {item.qty}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 font-medium">
                      Total: ₹{orderToDelete.totalAmount ? orderToDelete.totalAmount.toFixed(2) : orderToDelete.total.toFixed(2)}
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
