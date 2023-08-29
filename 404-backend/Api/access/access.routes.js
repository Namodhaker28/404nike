const express = require("express");
const Router = express.Router();
const accessController = require("./access.controller");
const Authentication  = require("../../middlewares/authetication");

const controller = new accessController()

Router.post("/signup", controller.createUser);
Router.post("/signin", controller.login);
Router.get("/refresh", controller.refresh);
Router.get("/logout", controller.logout);
Router.get("/users/all", controller.getAllUsers);
Router.get("/users/:id", controller.getSingleUser);
Router.delete("/users/:id", Authentication, controller.deleteUser);
Router.put("/users/:id", controller.updateUser);

Router.put('/wishlist',  Authentication, controller.addToWishlist)
Router.get('/wishlist',  Authentication, controller.getWishlist)

Router.post("/address", Authentication, controller.addAddress)

module.exports = Router
