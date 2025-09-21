// apps/ws-backend/src/handlers/connection.ts
import { Server, Socket } from "socket.io";
import { prismaClient } from "@repo/db/client";
import {
  addSocketForUser,
  removeSocket,
  getSocketCountForUser,
} from "../utlis/state";
import { joinRoomHandler, leaveRoomHandler } from "./rooms";
import { sendMessageHandler, typingHandler } from "./messages";

/**
 * connectionHandler: called when an authenticated socket connects
 */
export async function connectionHandler(io: Server, socket: Socket) {
  const userId: string = socket.data.userId;
  if (!userId) {
    socket.disconnect(true);
    return;
  }

  // BEFORE adding, get previous count to detect "first" connection
  const prevCount = getSocketCountForUser(userId);
  addSocketForUser(userId, socket.id);

  // If this was the user's first active socket, broadcast "user_online" to rooms they belong to
  if (prevCount === 0) {
    try {
      const parts = await prismaClient.roomParticipant.findMany({
        where: { userId },
        select: { roomId: true },
      });

      for (const p of parts) {
        io.to(`room:${p.roomId}`).emit("user_online", {
          roomId: p.roomId,
          userId,
        });
      }
    } catch (err) {
      console.error("presence (online) broadcast failed:", err);
    }
  }

  socket.emit("connected", { ok: true, userId });

  // Room handlers
  socket.on("join_room", (payload, cb) =>
    joinRoomHandler(io, socket, payload, cb)
  );
  socket.on("leave_room", (payload, cb) =>
    leaveRoomHandler(io, socket, payload, cb)
  );

  // Messages & typing
  socket.on("send_message", (payload, cb) =>
    sendMessageHandler(io, socket, payload, cb)
  );
  socket.on("typing", (payload) => typingHandler(socket, payload));

  // Clean up on disconnect
  socket.on("disconnect", async (reason) => {
    try {
      // record count BEFORE removal
      const before = getSocketCountForUser(userId);

      // remove socket from maps
      removeSocket(socket.id);

      // if this was the user's last socket, broadcast offline
      const after = getSocketCountForUser(userId);
      if (before > 0 && after === 0) {
        const parts = await prismaClient.roomParticipant.findMany({
          where: { userId },
          select: { roomId: true },
        });

        for (const p of parts) {
          io.to(`room:${p.roomId}`).emit("user_offline", {
            roomId: p.roomId,
            userId,
          });
        }
      }
    } catch (err) {
      console.error("disconnect cleanup failed:", err);
    }
  });
}
