
// function errorHandler(err, req, res, next) {

//   const statusCode = res.statusCode !== 200 ? res.statusCode : 500;


//   res.status(statusCode).json({
//     message: err.message || "في خطأ داخلي في الخادم",
//     ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
//   });
// }

// module.exports = errorHandler;

const errorHandler = (err, req, res, next) => {
  return returnJson(res, err.statusCode, false, err.message, null)
};

module.exports = errorHandler;

