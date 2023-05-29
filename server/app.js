import * as fs from "fs";
import * as path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import usersRoutes from "./routes/users-routes.js";
import postsRoutes from "./routes/posts-routes.js";
import commentsRoutes from "./routes/comments-routes.js";

const app = express();

app.use(bodyParser.json());

app.use(cors());

// app.use(cors({ allowedHeaders: ["X-Total-Count"] }));

// app.use((req, res, next) => {
//   res.header("Access-Control-Expose-Headers", "X-Total-Count");
//   next();
// });
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   // res.setHeader("Access-Control-Max-Age", "86400");
//   next();
// });

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((error, req, res, next) => {
  if (req.file) {
    console.log("see" + req.file);
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    console.log("This is those error?????");
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);

app.use((req, res, next) => {
  res.status(404).message("Could not find this route");
});

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
