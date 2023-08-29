const Product = require("./ProductModal");
const Category = require("./CategoryModal");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../../utils/validateMongodbId");

class ProductController {
  createProduct = asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  updateProduct = asyncHandler(async (req, res) => {
    const id = req.params;
    validateMongoDbId(id);
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
        new: true,
      });
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params;
    validateMongoDbId(id);
    try {
      const deleteProduct = await Product.findOneAndDelete(id);
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  getAllProducts = asyncHandler(async (req, res) => {
    try {
      //filter products

      const queryObj = { ...req.query };
      const excludeQuery = ["page", "limit", "sort", "fields"];
      excludeQuery.forEach((field) => delete queryObj[field]);
      let queryString = JSON.stringify(queryObj);
      queryString = queryString.replace(
        /\b(gte|lte|gt|lt)\b/g,
        (match) => `$${match}`
      );

      let query = Product.find(JSON.parse(queryString));

      //sort
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // limiting the fields
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      // pagination

      const page = req.query.page;
      const limit = req.query.limit;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
      if (req.query.page) {
        const productCount = await Product.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not exists");
      }

      const product = await query;
      res.send({
        msg: "all products fetched successfully",
        allProducts: product,
      });
    } catch (error) {
      throw error;
    }
  });

  addCategory = asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newCategory = await Category.create(req.body);
      res.json(newCategory);
    } catch (error) {
      throw new Error(error);
    }
  });

  getALlCategory = asyncHandler(async (req, res) => {
    try {
      const allCategory = await Category.find();
      res.json(allCategory);
    } catch (error) {
      throw new Error(error);
    }
  });
}

module.exports = ProductController;
