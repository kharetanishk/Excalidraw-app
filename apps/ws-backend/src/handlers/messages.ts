import { Server, Socket } from "socket.io";
import { prismaClient } from "@repo/db/client";
import { canSendAndRecord } from "../utlis/ratelimitter";
import { getSocketsInRoom } from "../utlis/state";

export function typingHandler(socket: Socket, payload: any) {
  const userId = socket.data.userId as string;
  const roomId = Number(payload?.roomId);
  const isTyping = !!payload?.isTyping;

  if (!roomId) return; // invalid

  socket.to(`room:${roomId}`).emit("typing", {
    roomId,
    userId,
    isTyping,
  });
}

export async function sendMessageHandler(
  io: Server,
  socket: Socket,
  payload: any,
  cb?: Function
) {
  try {
    const userId = socket.data.userId as string;
    const roomId = Number(payload?.roomId);
    const messageText = String(payload?.message ?? "").trim();
    const type = String(payload?.type ?? "text");

    if (!roomId || !messageText)
      return cb?.({ ok: false, error: "invalid_payload" });

    if (!canSendAndRecord(userId)) {
      return cb?.({ ok: false, error: "rate_limited" });
    }

    const socketsInRoom = getSocketsInRoom(`room:${roomId}`);
    const userInMemory = [...socketsInRoom].some(
      (sid) => io.sockets.sockets.get(sid)?.data?.userId === userId
    );

    if (!userInMemory) {
      const participant = await prismaClient.roomParticipant.findFirst({
        where: { roomId, userId },
      });
      if (!participant) return cb?.({ ok: false, error: "not_a_participant" });
    }

    const chat = await prismaClient.chat.create({
      data: {
        roomId,
        userId,
        message: messageText,
        type,
      },
    });

    io.to(`room:${roomId}`).emit("new_message", chat);

    return cb?.({ ok: true, message: chat });
  } catch (err) {
    console.error("send_message error", err);
    return cb?.({ ok: false, error: "server_error" });
  }
}
