// app/api/expenses/summary/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Expense from '../../models/data.model';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    // Build date filter
    const filter = {};
    if (date) {
      filter.date = date;
    }

    // Get total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get expenses by category
    const categoryExpenses = await Expense.aggregate([
      { $match: filter },
      { $group: { 
        _id: '$category', 
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { total: -1 } }
    ]);

    const total = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

    // Format category data
    const categories = {};
    const validCategories = ['food', 'transport', 'shopping', 'bills', 'other'];
    validCategories.forEach(cat => {
      const found = categoryExpenses.find(c => c._id === cat);
      categories[cat] = found ? found.total : 0;
    });

    return NextResponse.json({
      success: true,
      data: {
        total,
        categories,
        categoryDetails: categoryExpenses,
        date: date || 'all'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/expenses/summary error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch summary',
      message: error.message
    }, { status: 500 });
  }
}