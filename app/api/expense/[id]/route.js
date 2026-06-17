import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Expense from "../../../models/data.model";

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const body = await request.json();

    const expense = await Expense.findOneAndUpdate(
      { id: params.id },
      body,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    await Expense.findOneAndDelete({
      id: params.id,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}