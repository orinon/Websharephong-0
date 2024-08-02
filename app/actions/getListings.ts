import ListingRepository from "@/app/actions/pattern/ListingRepository"; 
import { IListingsParams } from "@/app/actions/pattern/ListingRepository";

export default async function getListings(params: IListingsParams) {
  try {
    // Sử dụng Repository để lấy danh sách các listing
    const listings = await ListingRepository.getListings(params);

    // Trả về danh sách các listing đã được lấy
    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
}
