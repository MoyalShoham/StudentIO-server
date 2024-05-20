import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postRoute from "./routes/post_route";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";

const initApp = () => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    mongoose.connect(process.env.DATABASE_URL).then(() => {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));


      app.use("/post", postRoute);
      app.use("/auth", authRoute);
      app.use("/files", fileRoute);

      app.use('/public', express.static("public"));
      app.use('/uploads', express.static("uploads"));

      resolve(app);
    })
  });
  return promise;
};

export default initApp;
