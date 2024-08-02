import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
  private static instance: PrismaClient | null = null;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient();
    }
    return PrismaSingleton.instance;
  }
}

const prisma = PrismaSingleton.getInstance();

export default prisma;
