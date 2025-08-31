import express from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import authroutes from "./routes/auth.route";
import { CreateUserSchema } from "@repo/common/types";

const app = express();
console.log(JWT_SECRET);
app.use("/api/auth", authroutes);

const data = CreateUserSchema.safeParse;
