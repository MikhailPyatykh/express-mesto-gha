const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const errorStatus = require("../utils/errorsStatus");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(errorStatus.UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(errorStatus.UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  next();
};
