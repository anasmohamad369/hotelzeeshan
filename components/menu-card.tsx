"use client"

import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MenuItem, CartItem } from "@/lib/menu-data"

interface MenuCardProps {
  item: MenuItem
  cartItem?: CartItem
  onAdd: (item: MenuItem) => void
  onRemove: (slug: string) => void
}

export default function MenuCard({ item, cartItem, onAdd, onRemove }: MenuCardProps) {
  const quantity = cartItem?.quantity || 0

  return (
    <Card className="group overflow-hidden bg-card hover:shadow-xl transition-all duration-300 border-border/50">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.item}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {quantity > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
            {quantity} in cart
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-card-foreground capitalize text-lg leading-tight mb-1">{item.item}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-primary">₹{item.price}</span>

          {quantity === 0 ? (
            <Button size="sm" onClick={() => onAdd(item)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 bg-transparent"
                onClick={() => onRemove(item.slug)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button size="icon" className="h-8 w-8 bg-primary" onClick={() => onAdd(item)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
