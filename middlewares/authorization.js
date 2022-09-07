const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const status = require('../utils/errors');

module.exports.authorization = (req, res, next) => {
  const requestHandler = new Promise((resolve, reject) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      reject(status.UNAUTHORIZED);
    }
    resolve(authorization);
  });

  requestHandler
    .then((authorization) => {
      const payload = jwt.verify(
        authorization.replace('Bearer ', ''),
        JWT_SECRET,
      );
      req.user = payload;
      next();
    })
    .catch((err) => {
      next(err);
    });
};
