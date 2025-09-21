import express from "express";
import cors from "cors";
import authroutes from "./routes/auth.route";
import roomRoutes from "./routes/room.route";
import { errorHandler } from "./middlewares/errorhandle";

const port = 4000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authroutes);
app.use("/api/rooms", roomRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`the app is listening to http://localhost:${port}`);
});
