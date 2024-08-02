// ListingRepositoryId.ts
import prisma from "@/app/libs/prismadb";
export interface IParams {
    listingId?: string;
  }
class ListingRepositoryId {
  private static instance: ListingRepositoryId;

  private constructor() {}

  public static getInstance(): ListingRepositoryId {
    if (!ListingRepositoryId.instance) {
      ListingRepositoryId.instance = new ListingRepositoryId();
    }
    return ListingRepositoryId.instance;
  }

  public async getListingById(params: IParams) {
    try {
      const { listingId } = params;

      const listing = await prisma.listing.findUnique({
        where: {
          id: listingId,
        },
        include: {
          user: true
        }
      });

      if (!listing) {
        return null;
      }

      return {
        ...listing,
        createdAt: listing.createdAt.toString(),
        user: {
          ...listing.user,
          createdAt: listing.user.createdAt.toString(),
          updatedAt: listing.user.updatedAt.toString(),
          emailVerified: 
            listing.user.emailVerified?.toString() || null,
        }
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default ListingRepositoryId.getInstance();
