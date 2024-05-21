import express from "express";
import authController from "../controllers/auth_controller";
import authMiddleware from "../common/auth_middleware";
// import authMiddleware from "../common/auth_middleware";
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
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*         - full_name
*         - _id
*         - profile_picture
*         - gender
*         - tokens
*         - posts
*         - student
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
*           type: string[]
*           description: The user tokens (access & refresh)
*         posts:
*           type: string[]
*           description: The user posts ids
*         student:
*          type: IStudent
*          description: The student object
* 
*  
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*         full_name: 'Bob Marly'
*         profile_picture: 'http://localhost:3000/uploads/elyaaaa.png'
*         gender: 'Male'
*         student: {
*           "faculty": "Software Engineering",
*           "year": 3,
*         }
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
*     summary: registers a new user
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
*     summary: login existing user by email and password
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The acess & refresh tokens
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
*     summary: logout a user
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: logout completed successfully
*/
router.get("/logout", authMiddleware, authController.logout);

/**
* @swagger
* /auth/refresh:
*   get:
*     summary: get a new access and refresh tokens using the refresh token
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The acess & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/
router.get("/refresh", authController.refresh);


router.put("/update", authMiddleware, authController.edit_profile);

router.delete("/delete", authMiddleware, authController.delete_profile);

router.get('/user',authMiddleware, authController.getUser);

router.get('/users', authController.getUsers);

router.get('/user/:id',  authController.getUserById);

router.get('/userCheck', authMiddleware, authController.userCheck);

export default router;
