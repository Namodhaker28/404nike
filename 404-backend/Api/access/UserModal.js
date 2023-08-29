const mongoose = require("mongoose"); // Erase if already required
const { ObjectId } = require('mongodb');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role : {
      type:String
    },
    refreshToken: {
      type: String,
    },
    cart: {
      type: Array,
      default: [],
    },
    // address: [{ type: ObjectId, ref: "Address" }],
    address : {
      type: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
