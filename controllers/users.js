const User = require("../models/user");
const router = require("express").Router();

//Возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.name}` });
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
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Передан некорректный _id пользователя" });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

//Создаём нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
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
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
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
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};
