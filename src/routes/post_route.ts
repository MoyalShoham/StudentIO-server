import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";
 


router.get("/", postController.get.bind(postController));

router.get("/:id", postController.getById.bind(postController));

router.post("/upload", authMiddleware, postController.post.bind(postController));

router.get("/my/posts", authMiddleware, postController.get_my_posts.bind(postController));

router.get("/all/posts", authMiddleware, postController.get_all_posts.bind(postController));

router.post("/upload-file", postController.upload.single('file'), postController.upload_file.bind(postController));

router.put("/:id", postController.put.bind(postController));

router.delete("/:id", postController.remove.bind(postController));

router.put("/update/:id", postController.edit_post.bind(postController));

router.delete("/delete/:id", postController.delete_post.bind(postController));

export default router;
