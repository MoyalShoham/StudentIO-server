import express from "express";
import multer from "multer";
import {req, file, cb} from "multer";
import {Request, Response} from "express"

const router = express.Router();


const base = "http://localhost:3000/uploads/";

const storage = multer.diskStorage({
  destination: function (req: req, file: file, cb: cb) {
    cb(null, "uploads/");
  },
  filename: function (req: req, file: file, cb: cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  console.log("uploading file");
  if (!req.body.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  console.log("check: " + base + req.body.file.filename);
  res
    .status(200)
    .json({ message: "Uploaded successfully", url: base + req.body.file.filename });
});

export default router;