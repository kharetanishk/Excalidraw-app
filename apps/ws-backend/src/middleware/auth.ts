import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function authMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token =
      (socket.handshake.auth && socket.handshake.auth.token) ||
      socket.handshake.query?.token;

    if (!token) return next(new Error("Authentication error: token missing"));

    const decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload;
    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return next(new Error("Authentication error: invalid token"));
    }

    socket.data.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}
