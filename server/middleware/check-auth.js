import Jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "User is not authorized" });
    }

    const decodedToken = Jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return res.status(403).json({ message: "User is not authorized" });
  }
};
