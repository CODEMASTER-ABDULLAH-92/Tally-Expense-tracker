import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Expense from "../../../models/data.model";

// GET a single expense
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const expense = await Expense.findOne({ id: id });
    
    if (!expense) {
      return NextResponse.json(
        { success: false, error: "Expense not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE an expense
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const expense = await Expense.findOneAndUpdate(
      { id: id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return NextResponse.json(
        { success: false, error: "Expense not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE an expense
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const expense = await Expense.findOneAndDelete({ id: id });
    
    if (!expense) {
      return NextResponse.json(
        { success: false, error: "Expense not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}