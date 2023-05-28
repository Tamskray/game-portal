import Router from "express";
import PostController from "../controllers/posts-controller.js";
// import { check } from "express-validator";
import { checkAuth } from "../middleware/check-auth.js";
// import { checkRole } from "../middleware/check-role.js";

const router = new Router();

router.get("/", PostController.getPosts);
router.get("/:pid", PostController.getPostById);
router.get("/user/:uid", PostController.getPosts);

router.use(checkAuth);

router.post("/", PostController.createPost);
router.patch("/:pid", PostController.updatePost);

router.patch("/:pid/like", PostController.updatePostLike);

router.delete("/:pid", PostController.deletePost);

export default router;
