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
app.get("/", (req, res) => {
  res.send("api is working");
});
app.use(userRoutes);
app.use(postRoutes);

app.use(express.static("uploads"));
const PORT = process.env.PORT || 8080;

const start = async () => {
  const connectDB = await mongoose.connect(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
start();
