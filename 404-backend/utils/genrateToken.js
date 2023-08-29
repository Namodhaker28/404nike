var jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_KEY, { expiresIn: "1d" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_KEY, { expiresIn: "7d" });
};
module.exports = { generateAccessToken ,generateRefreshToken };
