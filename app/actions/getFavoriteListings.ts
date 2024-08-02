// getFavoriteListings.ts
import FavoriteListingsRepository from "./pattern/FavoriteListingsRepository";

export default async function getFavoriteListings(userId: string) {
  try {
    return await FavoriteListingsRepository.getAll(userId);
  } catch (error: any) {
    throw new Error(error);
  }
}
