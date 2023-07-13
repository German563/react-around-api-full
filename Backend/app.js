require('dotenv').config();
const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use('*', cors());

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { port = 3000 } = process.env;


mongoose.connect('mongodb://127.0.0.1:27017/aroundb');
mongoose.set('strictQuery', false);

const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.use(cors());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.use(auth);
app.use('/', usersRouter);
app.use(cardsRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
