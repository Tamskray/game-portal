import Jwt from "jsonwebtoken";

export const checkRole = (roles) => {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "User is not authorized" });
      }

      const { roles: userRoles } = Jwt.verify(token, process.env.JWT_KEY);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return res.status(403).json({ message: "You don't have access" });
      }
      // req.userData = { userId: decodedToken.userId };
      next();
    } catch (err) {
      return res.status(403).json({ message: "User is not authorized" });
    }
  };
};
