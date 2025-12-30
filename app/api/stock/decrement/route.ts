import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';

// Stock Schema
const StockSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  item: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, default: 'desserts' },
}, { timestamps: true });

const Stock = mongoose.models.Stock || mongoose.model('Stock', StockSchema);

// POST - Decrement stock for ordered items
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { items } = body; // Array of { slug, quantity }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    const results = [];
    for (const item of items) {
      const { slug, quantity } = item;
      
      if (!slug || !quantity) {
        continue;
      }

      // Find the stock item
      const stockItem = await Stock.findOne({ slug, category: 'desserts' });
      
      if (stockItem) {
        // Decrement stock (ensure it doesn't go below 0)
        const newStock = Math.max(0, stockItem.stock - quantity);
        const updated = await Stock.findOneAndUpdate(
          { slug, category: 'desserts' },
          { stock: newStock },
          { new: true }
        );
        
        results.push({
          slug: updated.slug,
          stock: updated.stock,
          item: updated.item,
        });
      }
    }

    return NextResponse.json({ 
      message: 'Stock updated successfully',
      updated: results 
    });
  } catch (error) {
    console.error('Error decrementing stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}

