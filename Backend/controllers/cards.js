const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AccessError = require('../errors/access-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cardList) => res.send(cardList))
    .catch((error) => next(error));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Invalid Data');
      }
    })
    .catch(next);
};
const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card
    .findOne({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('No card with such Id'))
    .then((card) => {
      if (!card.owner.equals(owner)) {
        next(new AccessError('Cant delete tis card'));
      } else {
        Card.deleteOne(card)
          .then(() => res.status(200).send({ message: 'Card was deleted' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Data'));
      }
      throw err;
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('No card with such Id');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid Data');
      }
      throw err;
    })
    .catch(next);
};

const disLikeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('No card with such Id');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid Data');
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  disLikeCard,
  deleteCard,
};
