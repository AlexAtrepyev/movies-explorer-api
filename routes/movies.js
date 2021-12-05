const router = require('express').Router();
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');
const { postMovieValidation, deleteMovieValidation } = require('../middlewares/validator');

router.get('/', getMovies);

router.post('/', postMovieValidation, postMovie);

router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
