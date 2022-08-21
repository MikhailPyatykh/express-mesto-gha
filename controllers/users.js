const User = require("../models/user");
const validator = require("validator");
const errorStatus = require("../utils/errorsStatus");

//Возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res
        .status(errorStatus.DEFAULT_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка ${err.name}` });
    });
};

//Возвращаем пользователя по идентификатору
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new Error();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "Error") {
        res
          .status(errorStatus.DATA_NOT_FOUND_CODE)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      if (err.name === "CastError") {
        res
          .status(errorStatus.INCORRECT_DATA_CODE)
          .send({ message: "Переданы некорректные данные _id" });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

//Создаём нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({ name, about, avatar, email, password })
    .then((user) => {
      if (validator.isEmail(user.email)) {
        res.send({ data: user });
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError" || "Error") {
        res.status(errorStatus.INCORRECT_DATA_CODE).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

//Обновляем профиль
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "Error") {
        res
          .status(errorStatus.DATA_NOT_FOUND_CODE)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      if (err.name === "ValidationError") {
        res.status(errorStatus.INCORRECT_DATA_CODE).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

//Обновляем аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "Error") {
        res
          .status(errorStatus.DATA_NOT_FOUND_CODE)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      if (err.name === "ValidationError") {
        res.status(errorStatus.INCORRECT_DATA_CODE).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};
