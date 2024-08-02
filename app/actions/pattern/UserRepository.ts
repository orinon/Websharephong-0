// UserRepository.ts
import prisma from "@/app/libs/prismadb";

class UserRepository {
  public async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  public async findUserDetails(email: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    };
  }
}

export default new UserRepository();
