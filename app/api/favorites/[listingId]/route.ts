import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

interface IUserService {
  getCurrentUser(): Promise<any>;
  updateUserFavorites(userId: string, listingId: string, add: boolean): Promise<any>;
}

class UserService implements IUserService {
  async getCurrentUser(): Promise<any> {
    return getCurrentUser(); // Lấy thông tin người dùng hiện tại từ hàm đã được định nghĩa trước đó
  }

  async updateUserFavorites(userId: string, listingId: string, add: boolean): Promise<any> {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];
    if (add) {
      favoriteIds.push(listingId); // Thêm listingId vào danh sách yêu thích nếu add là true
    } else {
      favoriteIds = favoriteIds.filter(id => id !== listingId); // Loại bỏ listingId khỏi danh sách yêu thích nếu add là false
    }

    return prisma.user.update({
      where: {
        id: userId
      },
      data: {
        favoriteIds
      }
    });
  }
}

export async function POST(
  request: Request, 
  { params }: { params: IParams },
  userService: IUserService = new UserService() // Dependency Injection cho IUserService, mặc định sử dụng UserService
) {
  const currentUser = await userService.getCurrentUser(); // Sử dụng hàm getCurrentUser từ IUserService

  if (!currentUser) {
    return NextResponse.error(); // Trả về lỗi nếu không tìm thấy người dùng
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID'); // Ném một lỗi nếu listingId không hợp lệ
  }

  await userService.updateUserFavorites(currentUser.id, listingId, true); // Thêm listingId vào danh sách yêu thích của người dùng

  return NextResponse.json({ success: true }); // Trả về thành công
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams },
  userService: IUserService = new UserService() // Dependency Injection cho IUserService, mặc định sử dụng UserService
) {
  const currentUser = await userService.getCurrentUser(); // Sử dụng hàm getCurrentUser từ IUserService

  if (!currentUser) {
    return NextResponse.error(); // Trả về lỗi nếu không tìm thấy người dùng
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID'); // Ném một lỗi nếu listingId không hợp lệ
  }

  await userService.updateUserFavorites(currentUser.id, listingId, false); // Xóa listingId khỏi danh sách yêu thích của người dùng

  return NextResponse.json({ success: true }); // Trả về thành công
}
