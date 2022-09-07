const Card = require('../models/card');
const status = require('../utils/errors');

// Возвращаем все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

// Создаём новую карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

// Удаляем карточку по идентификатору с проверкой владельца
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      throw status.DATA_NOT_FOUND;
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card.delete();
        res.send(card);
      } else {
        throw status.ACCESS_DENIED;
      }
    })
    .catch((err) => next(err));
};

// Ставим карточке лайк
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw status.DATA_NOT_FOUND;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

// Удаляем у карточки лайк
module.exports.deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw status.DATA_NOT_FOUND;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};
