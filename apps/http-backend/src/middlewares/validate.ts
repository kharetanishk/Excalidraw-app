import type { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        errors: err.errors?.map((e: any) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }
  };
