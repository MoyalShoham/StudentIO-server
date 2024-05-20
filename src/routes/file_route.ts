import { Request, Response } from "express";
import multer from "multer";
import express from "express";

const router = express.Router();
const base = "http://172.20.10.4:3000/";
const storage = multer.diskStorage({
    destination: function (req: Request, file: unknown, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname + '.jpeg');
    },
});

const upload = multer({ storage: storage });

router.post("/file", upload.single("file"), (req: Request, res: Response) => {
    console.log(req.file);
    return res.status(200).send({url: base + req.file.path});
});

export default router;