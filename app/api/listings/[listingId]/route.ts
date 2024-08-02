import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId?: string;
}

interface IListingService {
  deleteListing(listingId: string): Promise<any>;
}

class ListingService implements IListingService {
  async deleteListing(listingId: string): Promise<any> {
    const reservations = await getReservations({ listingId });

    if (reservations.length > 0) {
      throw new Error('Không thể xóa mục có đặt chỗ liên quan');
    }

    return prisma.listing.delete({
      where: { id: listingId }
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
  listingService: IListingService = new ListingService()
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('ID không hợp lệ');
  }

  await listingService.deleteListing(listingId);

  return NextResponse.json({ success: true });
}
