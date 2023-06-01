import * as fs from "fs";

import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import Role from "../models/Role.js";

const generateAccessToken = (userId, email, roles) => {
  try {
    const payload = { userId, email, roles };
    return Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });
  } catch (err) {
    console.log(err);
    // throw new Error("Error");
  }
};

class UserController {
  async getUsers(req, res, next) {
    try {
      // const users = await User.find({}, "-password");
      const users = await User.find();

      // just check
      const formattedUsers = users.map(({ id, username }) => {
        return { id, username };
      });

      res.status(200).json(formattedUsers);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async getUserById(req, res, next) {
    try {
      const userId = req.params.uid;
      const user = await User.findById(userId);

      res.status(200).json({
        userId: user.id,
        email: user.email,
        username: user.username,
        posts: user.posts,
        image: user.image || null,
      });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

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

  async signup(req, res, next) {
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
      return res
        .status(422)
        .json({ message: "User exists already, email already exists" });
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
    // let token;
    // try {
    //   token = Jwt.sign(
    //     { userId: newUser.id, email: newUser.email, role: newUser.roles },
    //     process.env.JWT_KEY,
    //     { expiresIn: "1h" }
    //   );
    // } catch (err) {
    //   return res
    //     .status(500)
    //     .json({ message: "Signing up failed, please try again later", err });
    // }

    res.status(201).json({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      token: token,
      role: newUser.roles[0],
    });
  }

  async login(req, res, next) {
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
        message: `Invalid credentials, user with ${email} not found, could not log you in.`,
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
        message:
          "Invalid credentials, password not correct, could not log you in",
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
}

export default new UserController();
