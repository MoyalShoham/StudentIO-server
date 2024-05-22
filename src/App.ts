import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postRoute from "./routes/post_route";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";

import { Request, Response } from "express";
import passport from "passport";
import session from "express-session";


const initApp = () => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    mongoose.connect(process.env.DATABASE_URL).then(() => {

      app.use(express.json());
      
      app.use(session({
        secret: 'keyboard cat 123',
        resave: false,
        saveUninitialized: true,
      }));
      app.use(passport.initialize());
      app.use(passport.session());

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));


      app.use("/post", postRoute);
      app.use("/auth", authRoute);
      app.use("/files", fileRoute);

      app.use('/public', express.static("public"));
      app.use('/uploads', express.static("uploads"));


      function isLoggedIn(req, res, next) {
        req.user ? next() : res.sendStatus(401);
      }

      

      app.get("/", (req, res) => {
        res.send('<a href="/auth/google">Authenticate with Google</a>');
      });

      app.get('/auth/google', 
        passport.authenticate('google', { scope: ['profile', 'email'] }) 
      );
      app.get('/auth/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/protected', failureRedirect: '/login' })
      );



      app.get('/logout', (req: Request, res: Response) => {
        req.body.logout();
        req.body.session.destroy();
        res.redirect('/');
      });

      app.get('/protected', isLoggedIn, (req: Request, res: Response) => {
        res.send(req.cookies);
      
      })

      resolve(app);
    })
  });
  return promise;
};

export default initApp;
