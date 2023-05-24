import Router from "express";
import CommentController from "../controllers/comments-controller.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = new Router();

router.get("/post/:pid", CommentController.getCommentsByPostId);

router.use(checkAuth);

router.post("/", CommentController.createComment);

router.delete("/:cid", CommentController.deleteComment);

export default router;
