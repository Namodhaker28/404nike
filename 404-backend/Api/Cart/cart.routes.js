const express = require("express");
const Router = express.Router();
const cartController = require("./cart.controller");
const Authentication  = require("../../middlewares/authetication");

const Controller = new cartController()

Router.post('/cart',Authentication,Controller.addToCart)
Router.get('/cart',Authentication,Controller.getUserCart)

Router.post('/order',Authentication,Controller.createOrder)
Router.get('/order',Authentication,Controller.getOrder)
Router.put('/order/:id',Controller.updateOrderStatus)

module.exports = Router