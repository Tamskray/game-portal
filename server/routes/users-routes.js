import Router from "express";
import UserController from "../controllers/users-controller.js";
// import { check } from "express-validator";

const router = new Router();

router.get("/", UserController.getUsers);

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);

export default router;
