
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const {
  ERROR_CODE_USER, ERROR_CODE_BAD_REQUEST, ERROR_CODE_SERVER, message400, message500,
} = require('../utils/errors');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(ERROR_CODE_SERVER).send({ message: 'Internal server error' });
  }
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'User not found' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_USER).send({ message: message400 });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: message500 });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.create({
    name,
    about,
    avatar,
    email,
    password,
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_USER).send({ message: message400 });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: message500 });
      }
    });
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      about: req.body.about,
    }, { runValidators: true, new: true })
      .orFail(new Error('NotValidId'));
    res.send(user);
  } catch (err) {
    if (err.message === 'NotValidId') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'No such user' });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_USER).send({ message: err.message });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: message500 });
    }
  }
};

const updateAvatarUser = async (req, res) => {
  try {
    const avatarLink = req.body.avatar;
    const avatar = await User.findByIdAndUpdate(req.user._id, {
      avatar: avatarLink,
    }, { runValidators: true, new: true })
      .orFail(new Error('NotValidId'));
    res.send(avatar);
  } catch (err) {
    if (err.message === 'NotValidId') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'No such user' });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_USER).send({ message: err.message });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: message500 });
    }
  }
};

const login = (req, res) => {
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
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(400).send({ message: 'No such user' });
      } else if (err.name === 'ValidationError') {
        res.status(422).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Internal server error' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
  login,
};
