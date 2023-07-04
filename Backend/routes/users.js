const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatarUser);
module.exports = router;
