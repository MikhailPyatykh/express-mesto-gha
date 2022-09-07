const status = require('../utils/errors');

module.exports.errorsHandler = (err, req, res, next) => {
  if (!err.statusCode || !err.error || !err.message) {
    res.status(status.DEFAULT_ERROR.statusCode).send({
      error: status.DEFAULT_ERROR.error,
      message: status.DEFAULT_ERROR.message,
    });
  }
  res.status(err.statusCode).send({ error: err.error, message: err.message });
  next();
};
