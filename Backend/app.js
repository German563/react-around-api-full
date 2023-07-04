const express = require('express');
const mongoose = require('mongoose');
const { ERROR_CODE_BAD_REQUEST } = require('./utils/errors');
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const cors = require('cors');
const auth = require('./middlewares/auth');

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { port = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/aroundb');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

app.use(express.json()); // Parse request bodies as JSON

app.use(auth);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().required().custom(validateURL),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use('/', usersRouter);
app.use(cardsRouter);

app.use('/', (req, res) => {
  res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Requested resource not found' });
});
app.use(cors());
app.options('*', cors());
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
