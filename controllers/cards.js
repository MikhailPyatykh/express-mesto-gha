const Card = require('../models/card');
const error = require('../utils/errorsTemplate');

// Возвращаем все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(error.INCORRECT_DATA('Переданы некорректные данные пользователя, аватара пользователя или профиля'));
      }
      return next(err);
    });
};

// Удаляем карточку по идентификатору с проверкой владельца
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      throw error.DATA_NOT_FOUND('Карточка по указанному _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return card.remove();
      }
      throw error.ACCESS_DENIED('Нельзя просто так взять и удалить чужую карточку');
    })
    .then((deletedCard) => res.send({ message: `Карточка ${deletedCard._id} удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(error.INCORRECT_DATA('Переданы некорректные данные _id'));
      }
      return next(err);
    });
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
      throw error.DATA_NOT_FOUND('Переданный _id карточки не найден');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(error.INCORRECT_DATA('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
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
      throw error.DATA_NOT_FOUND('Переданный _id карточки не найден');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(error.INCORRECT_DATA('Переданы некорректные данные для снятия лайка'));
      }
      return next(err);
    });
};
