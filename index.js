import dotenv from "dotenv";
import connectDB from "./models/index.js";
import express from "express";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);
app.use("/user/posts", postRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
