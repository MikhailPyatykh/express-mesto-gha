const User = require("../models/user");

//Возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.name}` });
    });
};

//Возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  console.log(req.params.userId);
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
      } else {
        return res.status(500).send({ message: "Ошибка по-умолчанию" });
      }
    });
};

//Создаёт нового пользователя
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
        return res.status(500).send({ message: "Ошибка по-умолчанию" });
      }
    });
};

// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар
