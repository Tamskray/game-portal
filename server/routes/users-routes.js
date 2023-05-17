import Router from "express";
import UserController from "../controllers/users-controller.js";
// import { check } from "express-validator";
import { checkRole } from "../middleware/check-role.js";

const router = new Router();

router.get("/", checkRole(["USER", "ADMIN"]), UserController.getUsers);

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);

export default router;
