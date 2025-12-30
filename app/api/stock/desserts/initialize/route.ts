import { NextResponse } from 'next/server';
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

// POST - Initialize dessert stock
export async function POST() {
  try {
    await connectDB();
    
    const desserts = [
      { slug: 'apricot-delight', item: 'Apricot delight', stock: 5 },
      { slug: 'shatoot-malai', item: 'shatoot malai', stock: 0 },
      { slug: 'kubani-ka-mitha', item: 'kubani ka mitha', stock: 10 },
      { slug: 'kaddu-ka-kheer', item: 'kaddu ka kheer', stock: 8 },
      { slug: 'sitaphal-malai', item: 'sitaphal malai', stock: 3 },
    ];

    for (const dessert of desserts) {
      await Stock.findOneAndUpdate(
        { slug: dessert.slug, category: 'desserts' },
        { ...dessert, category: 'desserts' },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ message: 'Desserts initialized successfully' });
  } catch (error) {
    console.error('Error initializing stock:', error);
    return NextResponse.json({ error: 'Failed to initialize stock' }, { status: 500 });
  }
}

