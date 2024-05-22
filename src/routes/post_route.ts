import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The Post API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - message
 *         - owner
 *         - image
 *       properties:
 *         message:
 *           type: string
 *           description: The post message
 *         owner:
 *           type: string
 *           description: The post owner
 *         _pid:
 *           type: string
 *           description: The post id
 *         date:
 *           type: string
 *           format: date-time
 *           description: The post creation date
 *         image:
 *           type: string
 *           description: The post image
 *       example:
 *         message: "Hello World"
 *         owner: "60f3b3b3b3b3b3b3b3b3b3b3"
 *         _pid: "60f3b3b3b3b3b3b3b3b3b3"
 *         date: "2023-05-21T10:30:00Z"
 *         image: "http://localhost:3000/uploads/60f3b3b3b3b3b3b3b3b3b3.jpg"
 * 
 *     Token:
 *       type: object
 *       required:
 *         - access_token
 *       properties:
 *         access_token:
 *           type: string
 *           description: The JWT access token
 *       example:
 *         access_token: "eyJhbGciewqewqfgew"
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Returns the list of all the posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", postController.get.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get("/:id", postController.getById.bind(postController));

/**
 * @swagger
 * /post/upload:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post("/upload", authMiddleware, postController.post.bind(postController));

/**
 * @swagger
 * /post/my/posts:
 *   get:
 *     summary: Get posts of the authenticated user
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/my/posts", authMiddleware, postController.get_my_posts.bind(postController));

/**
 * @swagger
 * /post/all/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: List of all posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/all/posts", postController.get_all_posts.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.put("/:id", postController.edit_post.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete("/:id", authMiddleware, postController.delete_post.bind(postController));

export default router;
