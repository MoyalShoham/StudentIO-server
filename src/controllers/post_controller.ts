import BaseController from "./base_controller";
import Post, { IPost } from "../models/post_model";
import { Request, Response } from "express";
import User from "../models/user_model";

// import User from "../models/user_model";



  
// const upload = multer({ storage });
  
class PostController extends BaseController<IPost> {


    constructor() {
        super(Post);  
    }


    async edit_post(req: Request, res: Response) {
        try {
            const {message, owner, data, image} = req.body;
            const post = await Post.findByIdAndUpdate(req.params.id, {message, owner, data, image}, {new: true});
            res.status(200).send(post);
        } catch(error) {
            res.status(400).send(error.message);
        }
    }

    async delete_post(req: Request, res: Response) {
        try {
            const postRef = await Post.findById(req.params.id);
            const userRef = await User.findById(postRef.owner);
            userRef.posts = userRef.posts.filter((_pid) => _pid != `ObjectId(${req.params.id})`);
            await userRef.save();
            const post = await Post.findByIdAndDelete(req.params.id);
            res.status(200).send(post);
        } catch(error) {
            res.status(400).send(error.message);
        }

    }
        
    //post post! - works
    async post(req: Request, res: Response) {
        req.body.owner = req.body.user._id;
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
    //works
    async get_my_posts(req: Request, res: Response) {
        console.log("get posts");
        const user = req.body.user;
        const posts = await Post.find({owner: user._id});
        res.status(200).send(posts);
    }

    // get all posts!
    //the header should contain the token
    //works
    async get_all_posts(req: Request, res: Response) {
        const user = req.body.user;
        const posts = await Post.find();
        const result = [];
        for (const post of posts) {
            if (post.owner != user._id) {
                result.push(post);
            }
        }
        res.status(200).send(result);

    }

}

export default new PostController();