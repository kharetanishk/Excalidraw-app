import { Server, Socket } from "socket.io";
import { addSocketForUser, removeSocket } from "../utlis/state";
import { joinRoomHandler, leaveRoomHandler } from "./rooms";
// import { sendMessageHandler, typingHandler } from "./messages";

export function connectionHandler(io: Server, socket: Socket) {
  const userId: string = socket.data.userId;
  addSocketForUser(userId, socket.id);

  socket.emit("connected", { ok: true, userId });

  socket.on("join_room", (payload, cb) =>
    joinRoomHandler(io, socket, payload, cb)
  );
  socket.on("leave_room", (payload, cb) =>
    leaveRoomHandler(io, socket, payload, cb)
  );
  // socket.on("send_message", (payload, cb) => sendMessageHandler(io, socket, payload, cb));
  // socket.on("typing", (payload) => typingHandler(socket, payload));

  socket.on("disconnect", () => {
    removeSocket(socket.id);
  });
}
