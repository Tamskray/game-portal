import User from "../models/User.js";

import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

class UserController {
  async getUsers(req, res, next) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Error with registation", errors });
    }

    const { username, email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Signing up failed, please try again later", err });
    }

    if (existingUser) {
      return res
        .status(422)
        .json({ message: "User exists already, email already exists" });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Could not create user, please try again" });
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Signing up failed, please try again later", err });
    }

    res.status(201).json({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
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

    res.json({
      userId: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    });
  }
}

export default new UserController();
