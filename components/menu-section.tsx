"use client"

import MenuCard from "./menu-card"
import type { MenuItem, CartItem } from "@/lib/menu-data"

interface MenuSectionProps {
  title: string
  images: string
  items: MenuItem[]
  cart: CartItem[]
  onAdd: (item: Omit<CartItem, "quantity">) => void
  onRemove: (slug: string) => void
}

export default function  MenuSection({ title, images, items, cart, onAdd, onRemove }: MenuSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <img src={images} alt={title} className="w-12 h-12" />
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex-1 h-px bg-border ml-4" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <MenuCard
            key={item.item}
            item={item}
            cart={cart}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}
