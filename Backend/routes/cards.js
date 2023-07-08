const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getCards,
  createCard,
  likeCard,
  disLikeCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/),
  }),
}), createCard);
router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
}), deleteCard);
router.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
}), likeCard);
router.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
}), disLikeCard);
module.exports = router;
