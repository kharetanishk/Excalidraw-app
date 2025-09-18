import { Router } from "express";
import { signup, signin } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate";
import { createUserSchema, signInSchema } from "@repo/common/types";

const authroutes: Router = Router();

authroutes.post("/signup", validateBody(createUserSchema), signup);
authroutes.post("/signin", validateBody(signInSchema), signin);

export default authroutes;
