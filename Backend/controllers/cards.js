const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AccessError = require('../errors/access-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cardList) => res.send(cardList))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        next(new BadRequestError('Invalid Data'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  return Card.findOne({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('No card with such Id'))
    .then((card) => {
      if (!card.owner.equals(owner)) {
        next(new AccessError('Cannot delete this card'));
      } else {
        return Card.deleteOne(card);
      }
      return true;
    })
    .then(() => res.status(200).send({ message: 'Card was deleted' }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Invalid Data'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('No card with such Id'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Invalid Data'));
      } else {
        next(err);
      }
    });
};

const disLikeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('No card with such Id'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Invalid Data'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  disLikeCard,
  deleteCard,
};
