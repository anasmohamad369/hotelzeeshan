"use client"

import { ShoppingCart, Menu, X, BarChart3, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface NavProps {
  cartCount?: number
  onCartClick?: () => void
}

export default function Nav({ cartCount = 0, onCartClick }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
           <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-full" />
          
          <div className="flex flex-col items-center gap-0">
          <h1 className="text-lg font-semibold">  Zeeshan Biryani </h1>
          </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium hover:text-accent transition-colors">
              Menu
            </Link>
            <Link href="/orders" className="font-medium hover:text-accent transition-colors">
              Orders
            </Link>
            <Link href="/stats" className="font-medium hover:text-accent transition-colors flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Stats
            </Link>
            <Link href="/stock" className="font-medium hover:text-accent transition-colors flex items-center gap-1">
              <Package className="h-4 w-4" />
              Stock
            </Link>
            <Button variant="secondary" size="sm" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="secondary" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/10">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/"
              className="py-2 px-4 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className="py-2 px-4 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/stats"
              className="py-2 px-4 rounded-lg hover:bg-primary-foreground/10 transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              Stats
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
