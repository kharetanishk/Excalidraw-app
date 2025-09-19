import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET as RAW_JWT_SECRET } from "@repo/backend-common/config";

const JWT_SECRET: string = RAW_JWT_SECRET ?? "dev-secret";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded !== "object" || !decoded || !("userId" in decoded)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const payload = decoded as JwtPayload & { userId: string };

    const user = await prismaClient.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    (req as any).userId = user.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
