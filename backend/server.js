import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.route.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(postRoutes);

app.use(express.static("uploads"));

const start = async () => {
  const connectDB = await mongoose.connect(process.env.MONGODB_URI);
  app.listen(8080, () => {
    console.log("server is running on port 8080");
  });
};
start();
