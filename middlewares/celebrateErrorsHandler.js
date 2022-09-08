const { isCelebrateError } = require('celebrate');
const error = require('../utils/errorsTemplate');

module.exports.celebrateErrorsHandler = (err, req, res, next) => {
  console.log('celebrateErrorHandler...');
  if (isCelebrateError(err)) {
    next(error.INCORRECT_DATA('Переданы некорректные данные'));
  }
  next(err);
};
