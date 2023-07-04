const express = require('express');

const router = express.Router();
const {
  getCards,
  createCard,
  likeCard,
  disLikeCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', deleteCard);
router.put('/cards/:id/likes', likeCard);
router.delete('/cards/:id/likes', disLikeCard);
module.exports = router;
