import Router from "express";
import UserController from "../controllers/users-controller.js";
import { check } from "express-validator";
import { checkRole } from "../middleware/check-role.js";
import { fileUpload } from "../middleware/file-upload.js";
import { checkAuth } from "../middleware/check-auth.js";

import * as fs from "fs";

const router = new Router();

// router.get("/", UserController.getUsers);
router.get("/", UserController.getUsers);

router.get("/:uid", UserController.getUserById);

router.get("/profile/:uid", checkAuth, UserController.getUserProfileInfoById);

router.post(
  "/signup",
  fileUpload.single("image"),
  // (req, res) => {
  //   if (req.file) {
  //     console.log("i see file");
  //     fs.unlink(req.file.path, (err) => {
  //       console.log(err);
  //     });
  //   }
  // },
  [
    check("username", "Username must be from 3 to 18 characters").isLength({
      min: 3,
      max: 24,
    }),
    check("email", "Email is not valid").normalizeEmail().isEmail(),
    check("password", "Password must be from 4 to 18 characters").isLength({
      min: 4,
      max: 24,
    }),
  ],
  UserController.signup
);

router.post("/login", UserController.login);

router.patch(
  "/update-profile/:uid",
  checkAuth,
  fileUpload.single("image"),
  [
    check("username", "Username must be from 3 to 18 characters").isLength({
      min: 3,
      max: 24,
    }),
    check("email", "Email is not valid").normalizeEmail().isEmail(),
  ],
  UserController.updateUserProfile
);

router.patch("/role/:uid", UserController.changeUserRole);

router.delete("/:uid", UserController.deleteUser);

export default router;
