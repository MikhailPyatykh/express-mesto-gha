const error = require('../utils/errorsTemplate');

module.exports.errorsHandler = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(error.DEFAULT_ERROR('На сервере произошла ошибка'));
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};
