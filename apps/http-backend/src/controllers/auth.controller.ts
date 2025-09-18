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

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    // console.log(user);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    // console.log(valid);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: EXPIRES_IN,
    });
    return res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const check = (req: Request, res: Response) => {
  res.send("hello world");
};
