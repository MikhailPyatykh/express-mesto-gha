const Card = require("../models/card");
const errorStatus = require("../utils/errorsStatus");

// Возвращаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res
        .status(errorStatus.DEFAULT_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` })
    );
};

// Создаём новую карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(errorStatus.INCORRECT_DATA_CODE).send({
          message:
            "Переданы некорректные данные пользователя, аватара пользователя или профиля",
        });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

// Удаляем карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(errorStatus.INCORRECT_DATA_CODE)
          .send({ message: "Переданы некорректные данные _id" });
      }
      if (err.name === "Error") {
        res
          .status(errorStatus.DATA_NOT_FOUND_CODE)
          .send({ message: "Карточка по указанному _id не найдена" });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

// Ставим карточке лайк
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(errorStatus.INCORRECT_DATA_CODE).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }
      if (err.name === "Error") {
        res.status(errorStatus.DATA_NOT_FOUND_CODE).send({
          message: "Переданный _id карточки не найден",
        });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

// Удаляем у карточки лайк
module.exports.deleteLikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(errorStatus.INCORRECT_DATA_CODE).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
      }
      if (err.name === "Error") {
        res.status(errorStatus.DATA_NOT_FOUND_CODE).send({
          message: "Переданный _id карточки не найден",
        });
      } else {
        res
          .status(errorStatus.DEFAULT_ERROR_CODE)
          .send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};
