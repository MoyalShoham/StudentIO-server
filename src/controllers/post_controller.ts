import BaseController from "./base_controller";
import Post, { IPost } from "../models/post_model";
import { Request, Response } from "express";
import User from "../models/user_model";
// import User from "../models/user_model";
class PostController extends BaseController<IPost> {
    constructor() {
        super(Post);
    }

    async post(req: Request, res: Response) {
        // req.body.owner = req.body.user.student;
        req.body.owner = req.body.user._id;
        // const user = await User.findById(req.body.owner);

        const {message, owner, image} = req.body;

        req.body.post = {message, owner, image};
        
        const user = await User.findById(owner);
        if (user) {
            const post = await Post.create(req.body.post);
            if(post){
                const pid = `ObjectId(${post._id})`;
                user.posts.push(pid);
                await user.save();
                res.status(201).send(post);
            }
        }

    }
    // get my posts!
    //the header should contain the token
    async get_posts(req: Request, res: Response) {
        console.log("get posts");
        const user = req.body.user;
        const posts = await Post.find({owner: user._id});
        res.status(200).send(posts);
    }

    // async get_posts_by_user(req: Request, res: Response) {}

}

export default new PostController();