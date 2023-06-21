import * as fs from "fs";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import Role from "../models/Role.js";
import Post from "../models/Post.js";

const generateAccessToken = (userId, email, roles) => {
  try {
    const payload = { userId, email, roles };
    return Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });
  } catch (err) {
    console.log(err);
    // throw new Error(err);
  }
};

class UserController {
  // GET ALL USERS FOR OWNER
  async getUsers(req, res) {
    try {
      const userToken = req.query.token;

      const decodedToken = Jwt.verify(userToken, process.env.JWT_KEY);
      if (decodedToken.roles[0] === "OWNER") {
        // const users = await User.find({}, "-password");
        const users = await User.find(
          { roles: { $ne: "OWNER" } },
          "-password"
        ).sort({ roles: 1 });
        res.status(200).json(users);
      } else {
        return res.status(403).json({ message: "You don't have access" });
      }
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // GET USER BY ID
  async getUserById(req, res) {
    try {
      const userId = req.params.uid;
      const user = await User.findById(userId);

      res.status(200).json({
        userId: user.id,
        // email: user.email,
        username: user.username,
        posts: user.posts,
        image: user.image || null,
      });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // USER PROFILE INFO
  async getUserProfileInfoById(req, res) {
    const userId = req.params.uid;
    const { limit, page } = req.query;

    const pageSize = limit ? parseInt(limit) : 0;
    const pageNumber = page ? parseInt(page) : 0;

    let user;
    let comments;
    try {
      user = await User.findById(userId);

      comments = await Comment.find({ creatorId: userId })
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(pageSize * pageNumber);

      const totalCount = await Comment.countDocuments({ creatorId: userId });
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", totalCount);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({
      userId: user.id,
      email: user.email,
      username: user.username,
      image: user.image || null,
      comments: comments,
    });
  }

  // SIGNUP
  async signup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Error with registation", errors });
    }

    const { username, email, password } = req.body;

    // console.log(req.file.path);

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Signing up failed, please try again later", err });
    }

    if (existingUser) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
      }
    }

    let hashedPassword;
    let userRole;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      userRole = await Role.findOne({ value: "USER" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Could not create user, please try again" });
    }

    let imagePath;
    if (req.file) {
      imagePath = req.file.path;
    } else {
      imagePath = null;
    }

    const newUser = new User({
      username,
      email,
      image: imagePath,
      password: hashedPassword,
      roles: [userRole.value],
    });

    try {
      await newUser.save();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Signing up failed, please try again later ", err });
    }

    const token = generateAccessToken(newUser.id, newUser.email, newUser.roles);

    res.status(201).json({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      token: token,
      role: newUser.roles[0],
    });
  }

  // LOGIN
  async login(req, res) {
    const { email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Logging in failed, please try again later", err });
    }

    if (!existingUser) {
      return res.status(403).json({
        message: `Невірні облікові дані, користувача з поштою ${email} не знайдено, не вдалося увійти`,
      });
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      return res.status(500).json({
        message:
          "Could not log you in, please check your credentials and try again",
      });
    }

    if (!isValidPassword) {
      return res.status(403).json({
        message: "Невірні облікові дані, невірний пароль, не вдалося увійти",
      });
    }

    const token = generateAccessToken(
      existingUser.id,
      existingUser.email,
      existingUser.roles
    );

    res.status(201).json({
      userId: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      token: token,
      role: existingUser.roles[0],
    });
  }

  async changeUserRole(req, res) {
    try {
      const userId = req.params.uid;
      const { newRole } = req.body;

      console.log(newRole);

      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({
          message: `User with provided Id not found`,
        });
      }

      existingUser.roles = [newRole];

      await existingUser.save();

      return res.status(200).json({ message: "Role updated succesfully" });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.uid;

    let user;
    try {
      user = await User.findById(userId);

      const newCreator = await User.findById("64909f9c879bf0b06b4afc4a");

      if (!user) {
        return res
          .status(404)
          .json({ message: "Could not find user for this id" });
      }

      // hardcode id, beacause this is special created user for this
      await Post.updateMany(
        { creator: userId },
        { $set: { creator: "64909f9c879bf0b06b4afc4a" } }
      );

      newCreator.posts = newCreator.posts.concat(user.posts);
      await newCreator.save();

      await Comment.deleteMany({ creatorId: userId });

      await User.findByIdAndDelete(userId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a user" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  }

  // UPDATE USER PROFILE
  async updateUserProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(422).json({
        message: "Invalid inputs passed, please check your data",
        errors,
      });
    }
    const { username, email } = req.body;
    const userId = req.params.uid;

    let existingUser;
    try {
      existingUser = await User.findById(userId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a user", err });
    }

    if (existingUser._id.toString() !== req.userData.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this user profile" });
    }

    let existingUserWithNewEmail;
    try {
      existingUserWithNewEmail = await User.findOne({ email: email });
    } catch (err) {
      return res.status(500).json({
        message:
          "Something went wrong, could not check the uniqueness of the entered email",
        err,
      });
    }

    if (
      existingUserWithNewEmail &&
      existingUserWithNewEmail._id.toString() !== userId
    ) {
      return res.status(409).json({
        message: "Введена пошта вже використовується.",
      });
    }

    if (req.file) {
      existingUser.image &&
        fs.unlink(existingUser.image, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
    }

    let imagePath;
    if (req.file) {
      imagePath = req.file.path;
    } else {
      imagePath = existingUser.image;
    }

    existingUser.username = username;
    existingUser.email = email;
    existingUser.image = imagePath;

    console.log(existingUser);

    try {
      await existingUser.save();
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong, could not update a user profile",
        err,
      });
    }

    res.status(200).json(existingUser);
  }
}

export default new UserController();
