import { Server } from "socket.io";
import { authMiddleware } from "../middleware/auth";
import { connectionHandler } from "../handlers/connection";

export function registerSocketHandlers(io: Server) {
  io.use(authMiddleware);

  io.on("connection", (socket) => {
    connectionHandler(io, socket);
  });
}
