const express = require('express');
const Router = express.Router();
const ProductController = require('./product.controller');
const  Authentication =  require('../../middlewares/authetication')

const productController = new ProductController() ;

Router.post('/product',productController.createProduct)
Router.put('/product/:id',productController.updateProduct)
Router.delete('/product/:id',productController.deleteProduct)
Router.get('/product/:id',productController.getaProduct)
Router.get('/product/',productController.getAllProducts)


Router.post('/product/category',productController.addCategory)
Router.get('/product/category/all',productController.getALlCategory)






module.exports = Router