const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) throw new AuthError(401, 'Необходима авторизация');

  let payload;
  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthError(401, 'Необходима авторизация');
  }
  req.user = payload;

  next();
};
