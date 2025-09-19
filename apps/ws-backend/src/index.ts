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
