import Jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(403).json({ message: "User is not authorized" });
      // throw new Error("Authentication failed!");
    }

    const decodedToken = Jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    // console.log(req.userData);
    // console.log(decodedToken);
    next();
  } catch (err) {
    console.log(err);
    if (req.headers.authorization.split(" ")[1]) {
      return res.status(403).json({ message: "User is not authorized" });
    }
    // throw new Error("User is not authorized");
  }
};
