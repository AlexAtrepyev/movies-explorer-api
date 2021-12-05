const router = require('express').Router();
const { getUser, patchUser } = require('../controllers/users');
const { patchUserValidation } = require('../middlewares/validator');

router.get('/me', getUser);

router.patch('/me', patchUserValidation, patchUser);

module.exports = router;
