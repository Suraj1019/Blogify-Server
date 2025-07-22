const fs = require("fs");

let errorHandler = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500);
    res.json({ message: err.message });
  }
  next();
};

module.exports = errorHandler;
