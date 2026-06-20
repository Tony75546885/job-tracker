import { Request, Response, NextFunction } from "express";
import { applicationService } from "../services/application.service";
import {
  createApplicationSchema,
  updateApplicationSchema,
  updateStatusSchema,
} from "../validators/application";

function paramId(req: Request): string {
  const id = req.params.id;
  if (Array.isArray(id)) return id[0];
  return id;
}

export const applicationController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const apps = await applicationService.listByUser(req.userId!);
      res.json(apps);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const app = await applicationService.getById(paramId(req), req.userId!);
      res.json(app);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createApplicationSchema.parse(req.body);
      const app = await applicationService.create(req.userId!, data);
      res.status(201).json(app);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateApplicationSchema.parse(req.body);
      const app = await applicationService.update(
        paramId(req),
        req.userId!,
        data,
      );
      res.json(app);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      const app = await applicationService.updateStatus(
        paramId(req),
        req.userId!,
        status,
      );
      res.json(app);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await applicationService.remove(paramId(req), req.userId!);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
