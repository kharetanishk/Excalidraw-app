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

export const joinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    const room = await prismaClient.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const existing = await prismaClient.roomParticipant.findFirst({
      where: { userId, roomId },
    });

    if (!existing) {
      await prismaClient.roomParticipant.create({
        data: { userId, roomId },
      });
    }

    return res.status(200).json({ message: "Joined room", roomId });
  } catch (err) {
    next(err);
  }
};
