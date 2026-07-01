

// import { NextRequest, NextResponse } from 'next/server';
// import  dbConnect  from '../../lib/mongodb';
// import User from '../../lib/models/User'

// export async function GET() {
//   try {
//     await dbConnect();
//     const users = await User.find().select('-password').sort({ createdAt: -1 });
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch users' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { name, email, password } = await request.json();

//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { message: 'Name, email, and password are required' },
//         { status: 400 }
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         { message: 'Password must be at least 6 characters' },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: 'User with this email already exists' },
//         { status: 400 }
//       );
//     }

//     const user = await User.create({
//       name,
//       email,
//       password
//     });

//     return NextResponse.json({
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error creating user:', error);
//     return NextResponse.json(
//       { message: 'Failed to create user' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import  dbConnect  from '../../lib/mongodb';
import User from '../../lib/models/User'

export async function GET() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Fetching users...');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    console.log(`Found ${users.length} users`);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    console.log('Creating user:', { name, email });

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      password
    });

    console.log('User created successfully:', user._id);

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Failed to create user', error: String(error) },
      { status: 500 }
    );
  }
}