var jwt = require("jsonwebtoken");
const userSchema = require("../Api/access/UserModal");
const AsyncHandler = require("express-async-handler");
require("dotenv").config();

const authentication = AsyncHandler(async (req, res, next) => {
  try {
    if (!req?.headers?.authorization?.startsWith("Bearer "))
      throw new Error("No authorization present in headers");
    else {
      const token = req?.headers?.authorization?.split(" ")[1];
      const tokenObj = jwt.verify(token, process.env.JWT_KEY);
      if (tokenObj) {
        const user = userSchema.findById(tokenObj.id);
        req.user = user;
      } else {
        throw new Error("Invalid token");
      }
      next();
    }
  } catch (error) {
    throw error;
  }
});

// const isAdmin = AsyncHandler(async (req, res, next) => {
//   try {
//     if (req.user.role !== "admin") throw new Error("You must be an admin");
//     next();
//   } catch (error) {
//     throw error;
//   }
// });

module.exports = authentication;
// module.exports = isAdmin;

