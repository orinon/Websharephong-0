// ReservationRepository.ts
import prisma from "@/app/libs/prismadb";
export interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
  }
  

class ReservationRepository {
  private static instance: ReservationRepository;

  private constructor() {}

  public static getInstance(): ReservationRepository {
    if (!ReservationRepository.instance) {
      ReservationRepository.instance = new ReservationRepository();
    }
    return ReservationRepository.instance;
  }

  public async getReservations(params: IParams) {
    try {
      const { listingId, userId, authorId } = params;

      const query: any = {};
          
      if (listingId) {
        query.listingId = listingId;
      };

      if (userId) {
        query.userId = userId;
      }

      if (authorId) {
        query.listing = { userId: authorId };
      }

      const reservations = await prisma.reservation.findMany({
        where: query,
        include: {
          listing: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const safeReservations = reservations.map(
        (reservation) => ({
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
          ...reservation.listing,
          createdAt: reservation.listing.createdAt.toISOString(),
        },
      }));

      return safeReservations;
    } catch (error: any) {
      throw new Error('Bạn không thể đặt thêm phòng nữa');
    }
  }
}

export default ReservationRepository.getInstance();
