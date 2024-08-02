// getCurrentUser.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import userRepository from "@/app/actions/pattern/UserRepository";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    return await userRepository.findUserDetails(session.user.email as string);
  } catch (error: any) {
    return null;
  }
}
