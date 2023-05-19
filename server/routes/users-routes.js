import Router from "express";
import UserController from "../controllers/users-controller.js";
import { check } from "express-validator";
import { checkRole } from "../middleware/check-role.js";

const router = new Router();

router.get("/", checkRole(["USER", "ADMIN"]), UserController.getUsers);

router.post(
  "/signup",
  [
    check("username", "Username must contain at least 3 characters").isLength({
      min: 3,
    }),
    check("email", "Email is not valid").normalizeEmail().isEmail(),
    check("password", "Password must contain at least 4 characters").isLength({
      min: 4,
    }),
  ],
  UserController.signup
);
router.post("/login", UserController.login);

export default router;
