// import { NextResponse } from "next/server";
// import dbConnect from "../../lib/mongodb";
// import Expense from "../../models/data.model";
// import { randomUUID } from "crypto";

// // GET ALL EXPENSES
// export async function GET() {
//   try {
//     await dbConnect();

//     const expenses = await Expense.find({})
//       .sort({ date: -1 })
//       .lean();

//     return NextResponse.json({
//       success: true,
//       data: expenses,
//     });
//   } catch (error) {
//     console.error("GET ERROR:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// // CREATE EXPENSE
// export async function POST(request) {
//   try {
//     await dbConnect();

//     const body = await request.json();

//     const expense = await Expense.create({
//       id: randomUUID(),
//       date: body.date,
//       time: body.time,
//       category: body.category,
//       amount: Number(body.amount),
//       description: body.description || "",
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         data: expense,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST ERROR:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }







// app/api/expense/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
// import Expense from '../../models/Expense';
import Expense from "../../models/data.model";
import { randomUUID } from "crypto";
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit')) || 1000;
    const sort = searchParams.get('sort') || '-date,-time';

    // Build filter object
    const filter = {};
    
    if (date) {
      filter.date = date;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }

    // Build sort object
    const sortObj = {};
    const sortFields = sort.split(',');
    sortFields.forEach(field => {
      if (field.startsWith('-')) {
        sortObj[field.substring(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });

    const expenses = await Expense.find(filter)
      .sort(sortObj)
      .limit(limit)
      .lean();

    const total = await Expense.countDocuments(filter);

    // Get grouped data for the table view
    let groupedData = {};
    if (startDate && endDate) {
      const grouped = await Expense.getGroupedByDay(startDate, endDate);
      grouped.forEach(day => {
        groupedData[day._id] = {};
        day.categories.forEach(cat => {
          groupedData[day._id][cat.category] = {
            total: cat.total,
            items: cat.items
          };
        });
      });
    }

    return NextResponse.json({
      success: true,
      data: expenses,
      groupedData: groupedData,
      meta: {
        total,
        limit,
        filter: {
          date,
          category,
          startDate,
          endDate
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/expense error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch expenses',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['date', 'time', 'category', 'amount', 'description'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        missingFields
      }, { status: 400 });
    }

    // Validate amount
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be a positive number'
      }, { status: 400 });
    }

    // Validate category
    const validCategories = ['food', 'transport', 'shopping', 'bills', 'other'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category',
        validCategories
      }, { status: 400 });
    }

    // Create expense data
    const expenseData = {
      id: randomUUID(),
      date: body.date,
      time: body.time,
      category: body.category,
      amount: amount,
      description: body.description.trim()
    };

    // Create and save expense
    const expense = new Expense(expenseData);
    await expense.save();

    return NextResponse.json({
      success: true,
      data: expense.toJSON()
    }, { status: 201 });

  } catch (error) {
    console.error("================================");
    console.error("POST ERROR");
    console.error(error);
    console.error("MESSAGE:", error.message);
    console.error("STACK:", error.stack);
    console.error("================================");
  
    if (error.name === "ValidationError") {
      const validationErrors = {};
  
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
  
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          validationErrors,
        },
        { status: 400 }
      );
    }
  
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}