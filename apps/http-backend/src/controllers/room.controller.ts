import { Request, Response, NextFunction } from "express";
import { prismaClient } from "@repo/db/client";
import { nanoid } from "nanoid";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;
    const { name, isPrivate, maxParticipants } = req.body;

    const room = await prismaClient.room.create({
      data: {
        name,
        slug: nanoid(10),
        adminId: userId,
        isPrivate,
        maxParticipants,
      },
    });

    await prismaClient.roomParticipant.create({
      data: { userId, roomId: room.id },
    });

    return res.status(201).json({ room });
  } catch (err) {
    next(err);
  }
};
