import BaseController from "./base_controller";
import Post, { IPost } from "../models/post_model";
import { Request, Response } from "express";

class PostController extends BaseController<IPost> {
    constructor() {
        super(Post);
    }

    async post(req: Request, res: Response) {
        req.body.owner = req.body.user.student;
        super.post(req, res);
    }
}

export default new PostController();