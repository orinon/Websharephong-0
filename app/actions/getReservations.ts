// getListings.ts
import ReservationRepository from "@/app/actions/pattern/ReservationRepository"; 

import { IParams } from "@/app/actions/pattern/ReservationRepository";

export default async function getReservations(params: IParams) {
  try {
    // Sử dụng Repository để lấy danh sách các đặt chỗ
  
    const reservations = await ReservationRepository.getReservations(params);

    // Trả về danh sách các đặt chỗ đã được lấy
    return reservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
