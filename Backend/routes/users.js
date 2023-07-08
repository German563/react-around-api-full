const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatarUser,
  getMe,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().hex(),
  }),
}), getUserById);
router.get('users/me', getMe);
router.get('/users/user', getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/),
  }),
}), updateAvatarUser);
module.exports = router;
