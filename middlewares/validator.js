const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const ValidationError = require('../errors/validation-error');

function validateURL(str) {
  if (validator.isURL(str)) {
    return str;
  }
  throw new ValidationError('Некорректный URL-адрес');
}

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const patchUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const postMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((str) => validateURL(str)),
    trailer: Joi.string().required().custom((str) => validateURL(str)),
    thumbnail: Joi.string().required().custom((str) => validateURL(str)),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  createUserValidation,
  patchUserValidation,
  signinValidation,
  postMovieValidation,
  deleteMovieValidation,
};
