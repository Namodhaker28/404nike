
const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404)
    next(error);
}

const errorHandler = (err, req, res, next) => {
    console.log(res.statusCode)
    console.log("error => ",err)
    res.json({
      status: "fail",
      message: err?.message,
      stack: err?.stack,
    });
  };
  
  module.exports = { errorHandler, notFound };