// import * as fs from "fs";
// import * as path from "path";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import usersRoutes from "./routes/users-routes.js";

const app = express();

app.use(bodyParser.json());

app.use("/api/users", usersRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.juvc9ln.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
