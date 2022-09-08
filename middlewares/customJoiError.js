const { isCelebrateError } = require('celebrate');

module.exports.customJoiError = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    next({ statusCode: 400, message: 'Ошибка валидации' });
  }

  next(err);
};
