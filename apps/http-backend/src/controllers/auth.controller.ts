import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET, EXPIRES_IN } from "@repo/backend-common/config";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const existing = await prismaClient.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing)
      return res.status(409).json({ message: "Email or username taken" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: { username, email, passwordHash },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: EXPIRES_IN,
    });
    return res
      .status(201)
      .json({ user: { id: user.id, email, username }, token });
  } catch (err) {
    next(err);
  }
};
