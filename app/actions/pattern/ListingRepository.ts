// ListingRepository.ts
import prisma from "@/app/libs/prismadb";
export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
  }

class ListingRepository {
  private static instance: ListingRepository;

  private constructor() {}

  public static getInstance(): ListingRepository {
    if (!ListingRepository.instance) {
      ListingRepository.instance = new ListingRepository();
    }
    return ListingRepository.instance;
  }

  public async getListings(params: IListingsParams) {
    try {
      const {
        userId,
        roomCount,
        guestCount,
        bathroomCount,
        locationValue,
        startDate,
        endDate,
        category,
      } = params;

      let query: any = {};

      if (userId) {
        query.userId = userId;
      }

      if (category) {
        query.category = category;
      }

      if (roomCount) {
        query.roomCount = {
          gte: +roomCount
        }
      }

      if (guestCount) {
        query.guestCount = {
          gte: +guestCount
        }
      }

      if (bathroomCount) {
        query.bathroomCount = {
          gte: +bathroomCount
        }
      }

      if (locationValue) {
        query.locationValue = locationValue;
      }

      if (startDate && endDate) {
        query.NOT = {
          reservations: {
            some: {
              OR: [
                {
                  endDate: { gte: startDate },
                  startDate: { lte: startDate }
                },
                {
                  startDate: { lte: endDate },
                  endDate: { gte: endDate }
                }
              ]
            }
          }
        }
      }

      const listings = await prisma.listing.findMany({
        where: query,
        orderBy: {
          createdAt: 'desc'
        }
      });

      const safeListings = listings.map((listing) => ({
        ...listing,
        createdAt: listing.createdAt.toISOString(),
      }));

      return safeListings;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default ListingRepository.getInstance();
