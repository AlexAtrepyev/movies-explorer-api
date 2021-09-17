const { isCelebrateError } = require('celebrate');

module.exports = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  function identifyBadProperty(details) {
    if (details.has('params')) {
      return 'params';
    }
    if (details.has('body')) {
      return 'body';
    }
    return null;
  }

  function parseCelebrateError(celebrateError) {
    try {
      const { details } = celebrateError;
      message = details.get(identifyBadProperty(details)).details[0].message;
    } catch (e) {
      message = 'Некорректный запрос';
    }
  }

  if (isCelebrateError(err)) {
    statusCode = 400;
    parseCelebrateError(err);
  }

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
};
