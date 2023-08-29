const userSchema = require("./UserModal");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
var jwt = require("jsonwebtoken");
const {
  generateRefreshToken,
  generateAccessToken,
} = require("../../utils/genrateToken");
require("dotenv").config();

class AccessController {
  createUser = asyncHandler(async (req, res) => {
    try {
      const { email, password, mobile, name } = req.body;
      if (!email || !password || !mobile || !name)
        return res.status(400).send({ message: "bad request" });

      const user = await userSchema.findOne({ email: req.body.email });

      if (!user) {
        req.body.password = await bcrypt.hash(password, 12);
        const newUser = new userSchema(req.body);
        await newUser.save();
        return res.status(200).send({ message: "signup successful" });
      } else {
        throw new Error("user already exists");
        // return res.status(409).send({ message: "User already exists" });
      }
    } catch (error) {
      console.log("errr", error);
      throw error;
    }
  });

  login = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new Error({ msg: "Invalid Credentials" });

      const user = await userSchema.findOne({ email: req.body.email });
      if (!user) throw new Error("User not registered signup first !!");
      else {
        const isPwdMatch = await bcrypt.compare(password, user.password);
        if (!isPwdMatch) throw new Error("Invalid Credentials");
        else {
          const refreshToken = generateRefreshToken(user._id);
          const updateduser = await userSchema.findByIdAndUpdate(
            user._id,
            { refreshToken: refreshToken },
            { new: true }
          );
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.status(200).send({
            message: "Signed in successfully",
            user: updateduser,
            accessToken: generateAccessToken(user._id),
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  refresh = asyncHandler(async (req, res) => {
    try {
      if (!req.cookies?.refreshToken) throw new Error("No cookies");

      const refreshToken = req.cookies.refreshToken;
      const user = await userSchema.findOne({ refreshToken });
      if (!user) throw new Error("user not found with this refresh token");

      const decoded = jwt.verify(refreshToken, process.env.JWT_KEY);
      if (decoded.id != user._id) throw new Error("token mismatch");

      res.status(200).json({ accessToken: generateAccessToken(user._id) });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  logout = asyncHandler(async (req, res) => {
    try {
      if (!req.cookies?.refreshToken) throw new Error("No cookies");

      const refreshToken = req.cookies.refreshToken;
      const user = await userSchema.findOne({ refreshToken });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      if (user) {
        await userSchema.findOneAndUpdate(refreshToken, { refreshToken: "" });
      }
      res.status(200).json({ msg: "logout success" });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  updateUser = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;
      const updatedUser = await userSchema.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (updatedUser) {
        return res
          .status(200)
          .send({ message: "update successful", updatedUser });
      } else {
        throw new Error("user not exists");
      }
    } catch (error) {
      console.log("errr", error);
      throw error;
    }
  });

  getAllUsers = asyncHandler(async (req, res) => {
    try {
      const allUsers = await userSchema.find();
      res.json(allUsers);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });

  getSingleUser = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;
      const User = await userSchema.findById(id);
      if (User) res.json(User);
      else throw new Error(`User ${id} not found`);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });

  deleteUser = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;
      const User = await userSchema.findByIdAndDelete(id);
      res.json({ msg: "user deleted successfuly", data: User });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });

  addAddress = asyncHandler(async (req, res) => {
    const { _id } = await req.user;
    try {
      const updatedUser = await userSchema.findByIdAndUpdate(
        _id,
        { address: req.body.address },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  });

  addToWishlist = asyncHandler(async (req, res) => {
    let user = await req.user;
    const { prodId } = req.body;

    try {
      const isAdded = await user.wishlist.find((id) => id.toString() === prodId);
      if (isAdded) {
        user = await userSchema.findOneAndUpdate(
          user._id,
          {
            $pull: { wishlist: prodId },
          },
          { new: true }
        );
      }
      else {
        user = await userSchema.findOneAndUpdate(
          user._id,
          {
            $push: { wishlist: prodId },
          },
          { new: true }
        );
      }
      res.json(user);
    } catch (error) {
      throw new Error(error);
    }
  });

getWishlist = asyncHandler(async (req, res) => {
  // const user = await req.user
  // console.log("req.user: " , user)
  const user = await req.user
  const usernew = await userSchema.findById(user._id).populate("wishlist").exec();
  res.json(usernew.wishlist);
})
}

module.exports = AccessController;
