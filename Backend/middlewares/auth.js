const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Authorization is required for access'));
  }

  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (_) {
    return next(new Unauthorized('Authorization is required for access'));
  }
  req.user = payload;
  return next();
};
