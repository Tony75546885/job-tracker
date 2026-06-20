import { ApplicationStatus } from "@prisma/client";
import { prisma } from "../config/db";
import { ApiError } from "../utils/api-error";
import { CreateApplicationInput, UpdateApplicationInput } from "../validators/application";

export const applicationService = {
  async listByUser(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string, userId: string) {
    const app = await prisma.application.findUnique({ where: { id } });
    if (!app || app.userId !== userId) {
      throw ApiError.notFound("Application not found");
    }
    return app;
  },

  async create(userId: string, input: CreateApplicationInput) {
    return prisma.application.create({
      data: {
        ...input,
        url: input.url || null,
        userId,
      },
    });
  },

  async update(id: string, userId: string, input: UpdateApplicationInput) {
    await this.getById(id, userId);
    return prisma.application.update({
      where: { id },
      data: {
        ...input,
        url: input.url === "" ? null : input.url,
      },
    });
  },

  async updateStatus(
    id: string,
    userId: string,
    status: ApplicationStatus,
  ) {
    await this.getById(id, userId);
    return prisma.application.update({
      where: { id },
      data: { status },
    });
  },

  async remove(id: string, userId: string) {
    await this.getById(id, userId);
    await prisma.application.delete({ where: { id } });
  },
};
