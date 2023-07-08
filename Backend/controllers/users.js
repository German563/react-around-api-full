const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUsers = async (req, res, next ) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};
const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid Data');
      }
      throw err;
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('No user with such id'));
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({ mail: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Invalid Data');
      } else if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Can`t use this email');
      } else next(err);
    })
    .catch(next);
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      about: req.body.about,
    }, { runValidators: true, new: true });

    if (!user) {
      throw new NotFoundError('No user with such id');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid Data'));
    } else {
      next(err);
    }
  }
};

const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  return User.findByIdAndUpdate(owner, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('No user with such id'));
      }
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ jwt: token });
    })
    .catch(() => {
      throw new UnauthorizedError('Failed to authorized');
    })
    .catch(next);
};

module.exports = {
  getMe,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
  login,
};
