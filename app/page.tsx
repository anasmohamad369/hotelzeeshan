"use client"

import { useState, useRef } from "react"
import Nav from "@/components/nav"
import CategoryTabs from "@/components/category-tabs"
import MenuSection from "@/components/menu-section"
import CartDrawer from "@/components/cart-drawer"
import { menuData, type MenuItem, type CartItem } from "@/lib/menu-data"
import { useMenuStock } from "@/lib/use-menu-stock"

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("biryaniSpecial")
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const dessertsWithStock = useMenuStock()

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.slug === item.slug)
      if (existing) {
        return prev.map((c) => (c.slug === item.slug ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (slug: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.slug === slug)
      if (existing && existing.quantity > 1) {
        return prev.map((c) => (c.slug === slug ? { ...c, quantity: c.quantity - 1 } : c))
      }
      return prev.filter((c) => c.slug !== slug)
    })
  }

  const clearCart = () => setCart([])

  const scrollToSection = (categoryId: string) => {
    setActiveCategory(categoryId)
    sectionRefs.current[categoryId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const menuSections = [
    { id: "biryaniSpecial", title: "Biryani Special", images: "/half-portion-mutton-biryani.jpg", items: menuData.biryaniSpecial },
    { id: "rotiItems", title: "Roti & Naan", images: "/plain-naan-bread.jpg", items: menuData.rotiItems },
    { id: "gravyItems", title: "Gravy Items", images: "/kadai-chicken-curry.jpg", items: menuData.gravyItems },
    { id: "tandooriSpecial", title: "Tandoori Special", images: "/tandoori.png", items: menuData.tandooriSpecial },
    { id: "nihariItems", title: "Nihari & More", images: "/paya.png", items: menuData.nihariItems },
    { id: "desserts", title: "Desserts", images: "/apricot.png", items: dessertsWithStock },
    { id: "extras", title: "Extras", images: "/apricot.png", items: menuData.extras },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Nav cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={scrollToSection} />

      {/* Hero Section */}
      <div className="bg-primary/5 py-8 mb-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Welcome to Hotel Zeeshan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the authentic taste of Hyderabadi cuisine. Order your favorite dishes and enjoy the royal
            flavors!
          </p>
        </div>
      </div>

      {/* Menu Sections */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        {menuSections.map((section) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el
            }}
            className="scroll-mt-32 "
          >
            <MenuSection
              title={section.title}
              images={section.images}
              items={section.items}
              cart={cart}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          </div>
        ))}
      </main>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold shadow-lg flex items-center justify-between px-6"
          >
            <span>View Cart ({cartCount} items)</span>
            <span>₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
          </button>
        </div>
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
      />
    </div>
  )
}
