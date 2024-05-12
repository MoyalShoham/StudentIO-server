import BaseController from "./base_controller";
import Post, { IPost } from "../models/post_model";
import { Request, Response } from "express";
import User from "../models/user_model";
import multer from "multer";
import { req, file, cb } from "multer";
import { Multer } from "multer";
// import User from "../models/user_model";



  
// const upload = multer({ storage });
  
class PostController extends BaseController<IPost> {
    upload: multer.Instance;
    storage: multer.StorageEngine;

    constructor() {
        super(Post);
     
        const upload = multer({ dest: 'uploads/'});
        this.upload = upload;
        this.storage = multer.diskStorage({
            destination: function (req: req, file: file, cb: cb) {
              cb(null, 'uploads/')
            },
            filename: function (req: req, file: file, cb: cb) {
              cb(null, file.fieldname + '-' + Date.now())
            }
          });
        // this.upload = multer({dest: 'uploads/'});
     
    }
    // Multer Configuration
    
    // ...

    // ...


    async edit_post(req: Request, res: Response) {
        try {
            console.log("update post");
            const post = await Post.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).send(post);
        } catch(error) {
            res.status(400).send(error.message);
        }
    }

    async delete_post(req: Request, res: Response) {
        try {
            console.log("delete post");
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
        

    // upload file
    // need to fix

    async upload_file(req: Request & {file : Multer.File}, res: Response) {
            
        console.log("upload file");
        console.log(file);

        console.log(req.file)

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        res.json({ message: "File uploaded successfully", filename: file.filename });
    }




    //post post! - works
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