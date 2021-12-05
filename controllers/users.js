const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const MongoError = require('../errors/mongo-error');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new MongoError('Пользователь с таким email уже существует');
      } else {
        throw new Error(err.message);
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '1d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24, httpOnly: true });
      res.send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};

module.exports.signout = (req, res, next) => {
  res.clearCookie('jwt');
  res.send({ message: 'Успешный выход' });
  return next();
};
