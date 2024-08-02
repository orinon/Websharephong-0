// import { NextResponse } from "next/server";
// import getCurrentUser from "@/app/actions/getCurrentUser";
// import prisma from "@/app/libs/prismadb";

// interface IParams {
//   title: string;
//   description: string;
//   imageSrc: string;
//   category: string;
//   roomCount: number;
//   bathroomCount: number;
//   guestCount: number;
//   location: {
//     value: string;
//   };
//   price: string;
// }

// interface IListingService {
//   createListing(listingData: IParams, userId: string): Promise<any>;
// }

// class ListingService implements IListingService {
//   async createListing(listingData: IParams, userId: string): Promise<any> {
//     const userListingCount = await prisma.listing.count({
//       where: {
//         userId: userId
//       }
//     });

//     if (userListingCount >= 3) {
//       throw new Error('Không thể thêm phòng');
//     }

//     return prisma.listing.create({
//       data: {
//         title: listingData.title,
//         description: listingData.description,
//         imageSrc: listingData.imageSrc,
//         category: listingData.category,
//         roomCount: listingData.roomCount,
//         bathroomCount: listingData.bathroomCount,
//         guestCount: listingData.guestCount,
//         locationValue: listingData.location.value,
//         price: parseInt(listingData.price, 10),
//         userId: userId
//       }
//     });
//   }
// }

// export async function POST(
//   request: Request, 
//   { params }: { params?: IParams }, // Đặt '?' để chỉ ra rằng params có thể không được truyền vào hoặc có thể là undefined
//   listingService: IListingService = new ListingService()
// ) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) {
//     return NextResponse.error();
//   }

//   if (!params || !params.title) {
//     throw new Error("Missing title in params");
//   }

//   try {
//     await listingService.createListing(params, currentUser.id);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     throw new Error(error as string);
//   }
// }

import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const userListingCount = await prisma.listing.count({
    where: {
      userId: currentUser.id
    }
  });

  if (userListingCount >= 3) {
    throw new Error('Không thể thêm phòng');
  }

  const body = await request.json();
  const { 
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
   } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id
    }
  });

  return NextResponse.json(listing);
}