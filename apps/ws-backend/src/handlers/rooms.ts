import { Server, Socket } from "socket.io";
import { prismaClient } from "@repo/db/client";
import {
  addSocketToRoom,
  removeSocketFromRoom,
  getSocketsInRoom,
} from "../utlis/state";

export async function joinRoomHandler(
  io: Server,
  socket: Socket,
  payload: any,
  cb?: Function
) {
  try {
    const userId = socket.data.userId;
    const roomId = Number(payload?.roomId);
    if (!roomId) return cb?.({ ok: false, error: "roomId required" });

    const room = await prismaClient.room.findUnique({ where: { id: roomId } });
    if (!room) return cb?.({ ok: false, error: "Room not found" });

    const socketsInRoom = getSocketsInRoom(`room:${roomId}`);
    if (socketsInRoom.size >= room.maxParticipants) {
      return cb?.({ ok: false, error: "Room is full" });
    }

    const existing = await prismaClient.roomParticipant.findFirst({
      where: { userId, roomId },
    });
    if (!existing) {
      await prismaClient.roomParticipant.create({ data: { userId, roomId } });
    }

    socket.join(`room:${roomId}`);
    addSocketToRoom(`room:${roomId}`, socket.id);

    socket.to(`room:${roomId}`).emit("user_joined", { roomId, userId });

    return cb?.({ ok: true, roomId });
  } catch (err) {
    console.error("join_room error", err);
    return cb?.({ ok: false, error: "server_error" });
  }
}

export async function leaveRoomHandler(
  io: Server,
  socket: Socket,
  payload: any,
  cb?: Function
) {
  try {
    const userId = socket.data.userId;
    const roomId = Number(payload?.roomId);
    if (!roomId) return cb?.({ ok: false, error: "roomId required" });

    socket.leave(`room:${roomId}`);
    removeSocketFromRoom(`room:${roomId}`, socket.id);

    socket.to(`room:${roomId}`).emit("user_left", { roomId, userId });

    return cb?.({ ok: true, roomId });
  } catch (err) {
    console.error("leave_room error", err);
    return cb?.({ ok: false, error: "server_error" });
  }
}
