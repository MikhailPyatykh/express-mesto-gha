const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const {
  cardValidation,
  idValidation,
} = require('../middlewares/requestsValidation');

const { authorization } = require('../middlewares/authorization');

router.use(authorization);

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', idValidation('cardId'), deleteCard);
router.put('/:cardId/likes', idValidation('cardId'), likeCard);
router.delete('/:cardId/likes', idValidation('cardId'), deleteLikeCard);

module.exports = router;
