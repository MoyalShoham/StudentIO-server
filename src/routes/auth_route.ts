import express from "express";
import authController from "../controllers/auth_controller";
import authMiddleware from "../common/auth_middleware";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
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
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - full_name
 *         - profile_picture
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         full_name:
 *           type: string
 *           description: The user full name
 *         _id:
 *           type: string
 *           description: The user id
 *         profile_picture:
 *           type: string
 *           description: The user profile picture
 *         gender:
 *           type: string
 *           description: The user gender
 *         tokens:
 *           type: array
 *           items:
 *             type: string
 *           description: The user tokens (access & refresh)
 *         posts:
 *           type: array
 *           items:
 *             type: string
 *           description: The user posts ids
 *         student:
 *           type: object
 *           properties:
 *             faculty:
 *               type: string
 *               description: The student's faculty
 *             year:
 *               type: integer
 *               description: The student's year
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *         full_name: 'Bob Marly'
 *         profile_picture: 'http://localhost:3000/uploads/elyaaaa.png'
 *         gender: 'Male'
 *         tokens: ['token1', 'token2']
 *         posts: ['post1', 'post2']
 *         student:
 *           faculty: 'Software Engineering'
 *           year: 3
 * 
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login existing user by email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Auth]
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout completed successfully
 */
router.get("/logout", authMiddleware, authController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Get new access and refresh tokens using the refresh token
 *     tags: [Auth]
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.get("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.put("/update", authMiddleware, authController.edit_profile);

/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: Delete user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 */
router.delete("/delete", authMiddleware, authController.delete_profile);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/user', authMiddleware, authController.getUser);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', authController.getUsers);

/**
 * @swagger
 * /auth/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/user/:id', authController.getUserById);

/**
 * @swagger
 * /auth/userCheck:
 *   get:
 *     summary: Check authenticated user's status
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User status check successful
 */
router.get('/userCheck', authMiddleware, authController.userCheck);

export default router;