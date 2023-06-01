import Router from "express";
import PostController from "../controllers/posts-controller.js";
// import { check } from "express-validator";
import { checkAuth } from "../middleware/check-auth.js";
// import { checkRole } from "../middleware/check-role.js";
import { fileUpload } from "../middleware/file-upload.js";

const router = new Router();

router.get("/", PostController.getPosts);
router.get("/news", PostController.getPosts);
router.get("/articles", PostController.getPosts);
router.get("/reviews", PostController.getPosts);

router.get("/popular-posts", PostController.getPopularPosts);

router.get("/search", PostController.searchPosts);

router.get("/:pid", PostController.getPostById);
router.get("/user/:uid", PostController.getPosts);

router.use(checkAuth);

router.post("/", fileUpload.single("image"), PostController.createPost);
router.patch("/:pid", fileUpload.single("image"), PostController.updatePost);

router.patch("/:pid/like", PostController.updatePostLike);

router.delete("/:pid", PostController.deletePost);

export default router;
