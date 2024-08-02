// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// import prisma from "@/app/libs/prismadb";

// interface IUser {
//   email: string;
//   name: string;
//   password: string;
// }

// interface IUserService {
//   createUser(user: IUser): Promise<any>;
// }

// class UserService implements IUserService {
//   async createUser(user: IUser): Promise<any> {
//     const hashedPassword = await bcrypt.hash(user.password, 12);
//     return prisma.user.create({
//       data: {
//         email: user.email,
//         name: user.name,
//         hashedPassword,
//       }
//     });
//   }
// }

// export async function POST(
//   request: Request, 
//   { user }: { user: IUser },
//   userService: IUserService = new UserService()
// ) {
//   try {
//     await userService.createUser(user);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return NextResponse.error();
//   }
// }
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request, 
) {
  const body = await request.json();
  const { 
    email,
    name,
    password,
   } = body;

   const hashedPassword = await bcrypt.hash(password, 12);

   const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    }
  });

  return NextResponse.json(user);
}
