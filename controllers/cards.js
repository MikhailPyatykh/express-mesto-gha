const Card = require("../models/card");

// Возвращаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
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
        res.status(400).send({
          message:
            "переданы некорректные данные пользователя, аватара пользователя или профиля",
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}` });
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
      if (err.name === "Error") {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные _id" });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
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
        res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }
      if (err.name === "Error") {
        res.status(404).send({
          message: "Передан несуществующий _id карточки",
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}` });
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
        res.status(400).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
      }
      if (err.name === "Error") {
        res.status(404).send({
          message: "Передан несуществующий _id карточки",
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};
