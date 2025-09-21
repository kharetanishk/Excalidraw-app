import { Router } from "express";
import { createRoom } from "../controllers/room.controller";
import { joinRoom } from "../controllers/room.controller";
import { validateBody } from "../middlewares/validate";
import { createRoomSchema } from "@repo/common/types";
import { requireAuth } from "../middlewares/requiredauth";

const roomRoutes: Router = Router();

roomRoutes.post(
  "/create",
  requireAuth,
  validateBody(createRoomSchema),
  createRoom
);

roomRoutes.post("/join", requireAuth, joinRoom);

export default roomRoutes;
