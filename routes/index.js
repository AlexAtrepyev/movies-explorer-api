const router = require('express').Router();
const { createUser, signin, signout } = require('../controllers/users');
const { createUserValidation, signinValidation } = require('../middlewares/validator');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', createUserValidation, createUser);

router.post('/signin', signinValidation, signin);

router.use(auth);

router.post('/signout', signout);

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use(() => {
  throw new NotFoundError('Несуществующий роут');
});

module.exports = router;
