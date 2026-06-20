import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import supertest from "supertest";
import app from "../src/app";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
export const prisma = new PrismaClient({ adapter });
export const agent = supertest(app);

export { app };

export async function cleanDatabase() {
  await prisma.application.deleteMany();
  await prisma.user.deleteMany();
}

export async function registerUser(
  data = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  },
) {
  return agent.post("/api/auth/register").send(data);
}
