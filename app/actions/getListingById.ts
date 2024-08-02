import prisma from "@/app/libs/prismadb";


// getListingById.ts
import ListingRepositoryId from "@/app/actions/pattern/ListingRepositoryId"; // Import Repository
import {IParams} from "@/app/actions/pattern/ListingRepositoryId";

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    // Sử dụng Repository để lấy thông tin về listing
    
    const listing = await ListingRepositoryId.getListingById({ listingId });

    if (!listing) {
      return null;
    }

    // Chuyển đổi định dạng các thuộc tính và trả về kết quả
    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updatedAt: listing.user.updatedAt.toString(),
        emailVerified: listing.user.emailVerified?.toString() || null,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

