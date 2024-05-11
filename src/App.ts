import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import studentRoute from "./routes/student_route";
import postRoute from "./routes/post_route";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";

const initApp = () => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    mongoose.connect(process.env.DATABASE_URL).then(() => {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use("/student", studentRoute);
      app.use("/post", postRoute);
      app.use("/auth", authRoute);
      resolve(app);
    })
  });
  return promise;
};

export default initApp;
