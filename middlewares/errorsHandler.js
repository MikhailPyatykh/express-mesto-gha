const error = require('../utils/errorsTemplate');

module.exports.errorsHandler = (err, req, res, next) => {
  console.log('errorsHandler...');
  console.log({ err });
  if (!err.statusCode) {
    res.status(error.DEFAULT_ERROR.statusCode).send({ message: error.DEFAULT_ERROR.message });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};
