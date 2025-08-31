import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const authroutes = Router();

authroutes.post("/signup", registerUser);
authroutes.post("/signin", loginUser);

export default authroutes;
