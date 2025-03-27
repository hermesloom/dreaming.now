import { PrismaClient } from "@/generated/prisma";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithPrisma = global as typeof globalThis & {
    _prismaClient?: PrismaClient;
  };

  if (!globalWithPrisma._prismaClient) {
    prisma = new PrismaClient();
    globalWithPrisma._prismaClient = prisma;
  }
  prisma = globalWithPrisma._prismaClient;
} else {
  // In production mode, it's best to not use a global variable.
  prisma = new PrismaClient();
}

export default prisma;
