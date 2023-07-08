const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError, CastError } = require('mongoose').Error;

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;


const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('User not found'));
    } else {
      res.status(200).send({ data: user });
    }
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError('Invalid Data'));
    } else {
      next(err);
    }
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('No user with such id'));
    } else {
      res.status(200).send({ data: user });
    }
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(200).send({ mail: user.email });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof CastError) {
      next(new BadRequestError('Invalid Data'));
    } else if (err.name === 'MongoServerError' || err.code === 11000) {
      next(new ConflictError('Can\'t use this email'));
    } else {
      next(err);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { runValidators: true, new: true }
    );
    if (!user) {
      next(new NotFoundError('No user with such id'));
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError('Invalid Data'));
    } else {
      next(err);
    }
  }
};

const updateAvatarUser = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(owner, { avatar }, { new: true });
    if (!user) {
      next(new NotFoundError('No user with such id'));
    } else {
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' }
    );
    res.send({ jwt: token });
  } catch (err) {
    next(new UnauthorizedError('Failed to authorize'));
  }
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
