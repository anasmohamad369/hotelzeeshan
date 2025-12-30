"use client"

import { useEffect, useState } from "react"
import Nav from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Package, Plus, Minus, Save, RefreshCw } from "lucide-react"
import { menuData } from "@/lib/menu-data"
import Image from "next/image"

interface DessertStock {
  slug: string
  item: string
  image: string
  price: number
  stock: number
}

export default function StockPage() {
  const [desserts, setDesserts] = useState<DessertStock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [stockValues, setStockValues] = useState<Record<string, number>>({})
  const { toast } = useToast()

  // Initialize desserts from menu data
  useEffect(() => {
    const initialDesserts: DessertStock[] = menuData.desserts
      .filter((dessert) => dessert.slug && dessert.price !== undefined)
      .map((dessert) => ({
        slug: dessert.slug!,
        item: dessert.item,
        image: dessert.image,
        price: dessert.price!,
        stock: dessert.stock ?? 0,
      }))

    setDesserts(initialDesserts)
    const initialStockValues: Record<string, number> = {}
    initialDesserts.forEach((dessert) => {
      initialStockValues[dessert.slug] = dessert.stock
    })
    setStockValues(initialStockValues)
    setLoading(false)

    // Fetch stock from backend
    fetchStockFromBackend()
  }, [])

  const fetchStockFromBackend = async () => {
    try {
      const response = await fetch("/api/stock/desserts")
      console.log(response,"response")
      
      if (response.ok) {
        const backendStock = await response.json()
        // Update stock values from backend
        const updatedStockValues: Record<string, number> = { ...stockValues }
        backendStock.forEach((item: { slug: string; stock: number }) => {
          updatedStockValues[item.slug] = item.stock
        })
        setStockValues(updatedStockValues)
        
        // Update desserts state
        setDesserts((prev) =>
          prev.map((dessert) => ({
            ...dessert,
            stock: updatedStockValues[dessert.slug] ?? dessert.stock,
          }))
        )
      } else {
        // If backend doesn't have the endpoint yet, use local data
        console.log("Backend endpoint not available, using local data")
      }
    } catch (error) {
      console.error("Error fetching stock from backend:", error)
      // Continue with local data if backend fails
    }
  }

  const updateStock = (slug: string, delta: number) => {
    setStockValues((prev) => {
      const newValue = Math.max(0, (prev[slug] || 0) + delta)
      return { ...prev, [slug]: newValue }
    })
  }

  const setStockValue = (slug: string, value: string) => {
    const numValue = parseInt(value) || 0
    setStockValues((prev) => ({
      ...prev,
      [slug]: Math.max(0, numValue),
    }))
  }

  const saveStock = async (slug: string) => {
    setSaving((prev) => ({ ...prev, [slug]: true }))
    try {
      const stockValue = stockValues[slug] ?? 0

      // Update backend
      const response = await fetch("/api/stock/desserts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          stock: stockValue,
        }),
      })

      if (response.ok) {
        // Update local state
        setDesserts((prev) =>
          prev.map((dessert) =>
            dessert.slug === slug ? { ...dessert, stock: stockValue } : dessert
          )
        )

        toast({
          title: "Stock Updated",
          description: `Stock for ${desserts.find((d) => d.slug === slug)?.item} has been updated to ${stockValue}.`,
          variant: "default",
        })
      } else {
        throw new Error("Failed to update stock")
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving((prev) => ({ ...prev, [slug]: false }))
    }
  }

  const saveAllStock = async () => {
    setSaving((prev) => ({ ...prev, all: true }))
    try {
      // Update all items in backend
      const updates = desserts.map((dessert) => ({
        slug: dessert.slug,
        stock: stockValues[dessert.slug] ?? dessert.stock,
      }))

      const response = await fetch("/api/stock/desserts/bulk", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      })

      if (response.ok) {
        // Update local state
        setDesserts((prev) =>
          prev.map((dessert) => ({
            ...dessert,
            stock: stockValues[dessert.slug] ?? dessert.stock,
          }))
        )

        toast({
          title: "All Stock Updated",
          description: "All dessert stock has been updated successfully.",
          variant: "default",
        })
      } else {
        throw new Error("Failed to update stock")
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving((prev) => ({ ...prev, all: false }))
    }
  }

  const totalStock = desserts.reduce((sum, dessert) => sum + (stockValues[dessert.slug] ?? dessert.stock), 0)
  const outOfStockCount = desserts.filter(
    (dessert) => (stockValues[dessert.slug] ?? dessert.stock) === 0
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dessert Stock Management</h1>
              <p className="text-muted-foreground">Manage stock levels for all dessert items</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchStockFromBackend}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={saveAllStock} disabled={saving.all}>
                {saving.all ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save All
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{desserts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalStock}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stock Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {desserts.map((dessert) => {
            const currentStock = stockValues[dessert.slug] ?? dessert.stock
            const isOutOfStock = currentStock === 0
            const isLowStock = currentStock > 0 && currentStock <= 5

            return (
              <Card key={dessert.slug} className="overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={dessert.image || "/placeholder.svg"}
                    alt={dessert.item}
                    fill
                    className="object-cover"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                      <Badge variant="destructive" className="text-sm font-bold">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-amber-500 text-white">
                        Low Stock
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{dessert.item}</CardTitle>
                  <CardDescription>₹{dessert.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Stock Control */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateStock(dessert.slug, -1)}
                        disabled={currentStock === 0}
                        className="h-9 w-9"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={currentStock}
                        onChange={(e) => setStockValue(dessert.slug, e.target.value)}
                        className="text-center font-bold text-lg flex-1"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateStock(dessert.slug, 1)}
                        className="h-9 w-9"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={() => saveStock(dessert.slug)}
                      disabled={saving[dessert.slug]}
                      className="w-full"
                      variant={currentStock === dessert.stock ? "outline" : "default"}
                    >
                      {saving[dessert.slug] ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {currentStock === dessert.stock ? "Saved" : "Save Changes"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
