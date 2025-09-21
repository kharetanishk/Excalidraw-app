import http from "http";
import { Server } from "socket.io";
// import { registerSocketHandlers } from "./socket";

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: { origin: true },
  pingInterval: 25000,
  pingTimeout: 60000,
});

// Register all handlers
// registerSocketHandlers(io);

httpServer.listen(8000, () => {
  console.log(`WS server listening on port 8000 `);
});

//i have break the full functionality of ws-backend into steps--
/* 
step - 1 Authenticate via token.
Join a room.
Leave a room.
See events like user_joined / user_left.

step -2 
Users can see who’s online/offline in their rooms.
Users see “typing…” indicators.
Users can send & receive messages in real-time.
Server acknowledges each message (so frontend can show delivered).
Spam control (basic).
*/
