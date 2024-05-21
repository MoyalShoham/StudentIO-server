import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";
 

// /**
// * @swagger
// * tags:
// *   name: Post
// *   description: The Post API
// **/

/**
// * @swagger
// * components:
// *   securitySchemes:
// *     bearerAuth:
// *       type: http
// *       scheme: bearer
// *       bearerFormat: JWT
// */

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Post:
//  *       type: object
//  *       required:
//  *         - message
//  *         - owner
//  *         - _pid
//  *         - image
//  *       properties:
//  *         message:
//  *           type: string
//  *           description: The post message
//  *         owner:
//  *           type: string
//  *           description: The post owner
//  *         _pid:
//  *           type: string
//  *           description: The post id
//  *         image:
//  *           type: string
//  *           description: The post image
//  * 
//  *       example:
//  *         message: "Hello World"
//  *         owner: "60f3b3b3b3b3b3b3b3b3b3b3"
//  *         _pid: "60f3b3b3b3b3b3b3b3b3b3"
//  *         image: "http://localhost:3000/uploads/60f3b3b3b3b3b3b3b3b3b3.jpg"
//  *     
//  * 
//  *     Token:
//  *       type: object
//  *       required:
//  *         - access_token
//  *       properties:
//  *         access_token:
//  *           type: string
//  *           description: The JWT access token
//  *   
//  *      example:
//  *        access_token: "eyJhbGciewqewqfgew"
//  **/


// /**
//  * @swagger
//  * post/
//  * get:
//  * summary: Returns the list of all the posts
//  * tags: [Post]
//  * responses:
//  * 200:
//  * description: The list of the posts
//  * content:
//  * application/json:
//  * schema:
//  * type: array
//  * items:
//  * $ref: '#/components/schemas/Post'
//  * 
//  * 
//  **/ 
router.get("/", postController.get.bind(postController));

router.get("/:id", postController.getById.bind(postController));

router.post("/upload", authMiddleware, postController.post.bind(postController));

router.get("/my/posts", authMiddleware, postController.get_my_posts.bind(postController));

router.get("/all/posts", postController.get_all_posts.bind(postController));

// router.delete("/:id", postController.remove.bind(postController));

router.put("/:id", postController.edit_post.bind(postController));

router.delete("/:id", authMiddleware, postController.delete_post.bind(postController));

export default router;
