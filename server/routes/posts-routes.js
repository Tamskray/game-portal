import Router from "express";
import PostController from "../controllers/posts-controller.js";
// import { check } from "express-validator";
import { checkAuth } from "../middleware/check-auth.js";
// import { checkRole } from "../middleware/check-role.js";

const router = new Router();

router.get("/", PostController.getPosts);

router.use(checkAuth);

router.post("/", PostController.createPost);

router.delete("/:pid", PostController.deletePost);

export default router;
