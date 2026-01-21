"use client"

import { useState } from "react"
import { X, ShoppingBag, Trash2, Minus, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import type { CartItem, MenuItem } from "@/lib/menu-data"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onAdd: (item: Omit<CartItem, "quantity">) => void
  onRemove: (slug: string) => void
  onClear: () => void
}

export default function CartDrawer({ isOpen, onClose, cart, onAdd, onRemove, onClear }: CartDrawerProps) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [discount, setDiscount] = useState<number>(0)
  const { toast } = useToast()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountValue = discount || 0
  const discountAmount = (subtotal * discountValue) / 100
  const total = subtotal ;
  const totalAmount = total - discountAmount


  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    try {
      // Place order
      const response = await fetch("http://localhost:3001/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            name: item.item,
            qty: item.quantity,
            price: item.price,
            
          })),
          discount: discountValue,
          total: Math.round(total),
          totalAmount: Math.round(totalAmount),
        }),
      })

      if (response.ok) {
        // Decrement stock for dessert items
        const dessertSlugs = [
          'apricot-delight',
          'shatoot-malai',
          'kubani-ka-mitha',
          'kaddu-ka-kheer',
          'sitaphal-malai',
        ]
        
        // Filter only dessert items from cart
        const dessertItems = cart.filter((item) => 
          dessertSlugs.includes(item.slug)
        )

        if (dessertItems.length > 0) {
          // Decrement stock
          await fetch("/api/stock/decrement", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: dessertItems.map((item) => ({
                slug: item.slug,
                quantity: item.quantity,
              })),
            }),
          })
        }

        toast({
          title: "Order Placed Successfully!",
          description: "Your delicious food is on its way.",
          variant: "default",
        })
        setDiscount(0)
        onClear()
        onClose()
      } else {
        throw new Error("Failed to place order")
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-foreground/50 z-50 transition-opacity overflow-y-auto" onClick={onClose} />}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Your Order</h2>
              <span className="text-sm text-muted-foreground">
                ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm">Add some delicious items from our menu!</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4 overflow-hidden">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.slug} className="flex items-center gap-3 bg-white/80 rounded-lg p-3">
                      <div className="flex-1">
                        <h4 className="font-medium capitalize text-sm">{item.item}</h4>
                        <p className="text-primary font-semibold">
                          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => onRemove(item.slug)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button size="icon" className="h-7 w-7 bg-primary" onClick={() => onAdd(item)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t border-border p-4 space-y-3">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-base">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Discount (%)</span>
                      <Input
                        type="text"
                        // min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === "") {
                            setDiscount(0)
                            return
                          }
                          const parsed = parseFloat(val)
                          setDiscount(isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed)))
                        }}
                        className="h-8 w-16 text-right"
                      />
                    </div>
                    <span className="text-red-500">
                      {discountAmount > 0 ? `-₹${discountAmount.toFixed(2)}` : "₹0.00"}
                    </span>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{Math.round(totalAmount)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setDiscount(0)
                      onClear()
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      "Print Token"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
