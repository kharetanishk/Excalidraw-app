import express from "express";
import cors from "cors";

const port = 4000;
const app = express();

//these are the middleware
app.use(express.json());
app.use(cors());

//routes of the application

app.listen(port, () => {
  console.log(`the app is listening to http://localhost:${port}`);
});
