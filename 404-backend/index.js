const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const accessRouter = require('./Api/access/access.routes');
const productRouter = require('./Api/product/product.routes');
const cartRouter = require('./Api/Cart/cart.routes');
const { errorHandler, notFound } = require("./middlewares/errorHandlers");
var cors = require("cors");

require("dotenv").config();

const app = express();


app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT;
const db_uri = process.env.DB_URI;

const myRouter = express.Router();
app.use('/api/v1',myRouter)
myRouter.get("/", (req, res) => {
  res.send(`<h1>Welcome to 404-shop <> made with ♥️ by DevChef </h1> `);
});


app.use('/api/v1',accessRouter,productRouter,cartRouter)
// app.use('/api/v1',productRouter)

app.use(errorHandler)
app.use(notFound)





mongoose
  .connect(db_uri)
  .then(() => {
    console.log("mongodb connection successful");
  })
  .catch((err) => console.log("mongodb connectione error: " + err));

app.listen(port, () => {
  console.log("app listening on port ", port);
});


