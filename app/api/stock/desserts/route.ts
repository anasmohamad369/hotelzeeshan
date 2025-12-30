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

// GET - Get all dessert stock
export async function GET() {
  try {
    await connectDB();
    const stocks = await Stock.find({ category: 'desserts' });
    return NextResponse.json(
      stocks.map((stock) => ({
        slug: stock.slug,
        stock: stock.stock,
        item: stock.item,
      }))
    );
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}

// PUT - Update single dessert stock
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { slug, stock } = body;

    const updated = await Stock.findOneAndUpdate(
      { slug, category: 'desserts' },
      { stock, slug, item: getItemName(slug), category: 'desserts' },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      slug: updated.slug,
      stock: updated.stock,
      item: updated.item,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}

