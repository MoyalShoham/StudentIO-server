import express from "express";
const router = express.Router();
import studentController from "../controllers/student_controller";
import authMiddleware from "../common/auth_middleware";


/**
* @swagger
* tags:
*   name: Student
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   schemas:
*     Student:
*       type: object
*       required:
*         - _id
*         - name
*         - year
*         - faculty
*         - profilePic
*         - gender
*         - posts
*         - tokens
*       properties:
*         _id:
*           type: string
*           description: The user id
*         name:
*           type: string
*           description: The user name
*         year:
*           type: number
*           description: The user year
*         faculty:
*           type: string
*           description: The user faculty
*         profilePic:
*           type: File
*           description: The user profile picture
*         gender:
*           type: string
*           description: The user gender
*         posts:
*           type: array
*           description: The user posts
*         tokens:
*           type: array
*           description: The user tokens
*       example:
*         _id: '12345'
*         name: 'jhon'
*         year: 4
*         faculty: 'Software Engineering'
*         profilePic: 'null'
*         posts: []
*         gender: 'Male'
* 
*/


/**
* @swagger
* /student:
*   get:
*     summary: Get all students
*     tags: [Student]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: list of all the students
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                  $ref: '#/components/schemas/Student'
*/
router.get("/", authMiddleware, studentController.get.bind(studentController));


/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: 'Get a student by ID'
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: 'path'
 *         name: 'id'
 *         required: true
 *         schema:
 *           type: 'string'
 *           example: '12345'
 *         description: 'Unique ID of the student to retrieve'
 *     responses:
 *       '200':
 *         description: 'Student details'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.get("/:id", authMiddleware, studentController.getById.bind(studentController));

/**
 * @swagger
 * /student:
 *   post:
 *     summary: 'Create a new student'
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       '201':
 *         description: 'Student created successfully'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.post("/", authMiddleware, studentController.post.bind(studentController));

router.put("/:id", authMiddleware, studentController.put.bind(studentController));

router.delete("/:id", authMiddleware, studentController.remove.bind(studentController));

export default router;
