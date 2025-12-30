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

// Item name mapping
const getItemName = (slug: string): string => {
  const itemMap: Record<string, string> = {
    'apricot-delight': 'Apricot delight',
    'shatoot-malai': 'shatoot malai',
    'kubani-ka-mitha': 'kubani ka mitha',
    'kaddu-ka-kheer': 'kaddu ka kheer',
    'sitaphal-malai': 'sitaphal malai',
  };
  return itemMap[slug] || slug;
};

// PUT - Bulk update dessert stock
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { updates } = body;

    const results = [];
    for (const update of updates) {
      const updated = await Stock.findOneAndUpdate(
        { slug: update.slug, category: 'desserts' },
        { stock: update.stock, slug: update.slug, item: getItemName(update.slug), category: 'desserts' },
        { upsert: true, new: true }
      );
      results.push({
        slug: updated.slug,
        stock: updated.stock,
        item: updated.item,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error bulk updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}

