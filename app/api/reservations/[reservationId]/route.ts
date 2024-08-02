import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
interface IReservationService {
  deleteReservation(reservationId: string, userId: string): Promise<any>;
}

class ReservationService implements IReservationService {
  async deleteReservation(reservationId: string, userId: string): Promise<any> {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { userId: true }
    });

    if (!reservation) {
      throw new Error('Không tìm thấy đặt chỗ');
    }

    if (reservation.userId !== userId) {
      throw new Error('Bạn không có quyền xóa đặt chỗ này');
    }

    return prisma.reservation.delete({
      where: { id: reservationId }
    });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: { reservationId?: string } },
  reservationService: IReservationService = new ReservationService()
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('ID không hợp lệ');
  }

  try {
    await reservationService.deleteReservation(reservationId, currentUser.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.error();
  }
}
