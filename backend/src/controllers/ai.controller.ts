import { Request, Response, NextFunction } from "express";
import { aiService } from "../services/ai.service";
import { parseJobSchema } from "../validators/ai";

export const aiController = {
  async parseJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = parseJobSchema.parse(req.body);
      const result = await aiService.parseJobPosting(text);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
