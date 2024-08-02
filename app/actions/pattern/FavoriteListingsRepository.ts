// FavoriteListingsRepository.ts
import prisma from "@/app/libs/prismadb";

class FavoriteListingsRepository {
  private static instance: FavoriteListingsRepository;

  private constructor() {}

  public static getInstance(): FavoriteListingsRepository {
    if (!FavoriteListingsRepository.instance) {
      FavoriteListingsRepository.instance = new FavoriteListingsRepository();
    }
    return FavoriteListingsRepository.instance;
  }

  public async getAll(userId: string) {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favoriteIds: true, // Chỉ định thuộc tính favoriteIds để lấy danh sách các ID của các listing yêu thích của người dùng
      },
    });
    
    const favoriteIds = currentUser?.favoriteIds || [];
    
    // Truy vấn các listing tương ứng từ cơ sở dữ liệu bằng các ID đã lấy được
    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: favoriteIds,
        },
      },
    });

    return favorites;
  }
}

export default FavoriteListingsRepository.getInstance();
