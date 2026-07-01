// import { NextRequest, NextResponse } from 'next/server';
// import  dbConnect  from '../../../lib/mongodb';
// import User from '../../../lib/models/User'

// // PUT - Update a user
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { name, email } = await request.json();

//     if (!name || !email) {
//       return NextResponse.json(
//         { message: 'Name and email are required' },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     // Check if user exists
//     const user = await User.findById(params.id);
//     if (!user) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Check if email already exists for another user
//     const existingUser = await User.findOne({ 
//       email, 
//       _id: { $ne: params.id } 
//     });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: 'Email already in use by another user' },
//         { status: 400 }
//       );
//     }

//     // Update user
//     user.name = name;
//     user.email = email;
//     user.updatedAt = new Date();
//     await user.save();

//     return NextResponse.json({
//       message: 'User updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     });

//   } catch (error) {
//     console.error('Error updating user:', error);
//     return NextResponse.json(
//       { message: 'Failed to update user' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a user
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();

//     // Check if user exists
//     const user = await User.findById(params.id);
//     if (!user) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Delete user
//     await User.findByIdAndDelete(params.id);

//     return NextResponse.json({
//       message: 'User deleted successfully'
//     });

//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return NextResponse.json(
//       { message: 'Failed to delete user' },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from 'next/server';

import  dbConnect  from '../../../lib/mongodb';
import User from '../../../lib/models/User'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: params.id } 
    });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use by another user' },
        { status: 400 }
      );
    }

    user.name = name;
    user.email = email;
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}