"use client"

import { useState } from "react"
import { X, ShoppingBag, Trash2, Minus, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const { toast } = useToast()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const total = subtotal

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    try {
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
          total: total,
        }),
      })

      if (response.ok) {
        toast({
          title: "Order Placed Successfully!",
          description: "Your delicious food is on its way.",
          variant: "default",
        })
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
                <div className="space-y-1 text-sm">
                

                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={onClear}>
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
