const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const error = require('../utils/errorsTemplate');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(error.UNAUTHORIZED('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    const key = (k) => {
      if (k === 'production') {
        return JWT_SECRET;
      } return 'dev-secret';
    };
    payload = jwt.verify(token, key(NODE_ENV));
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(error.UNAUTHORIZED('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
