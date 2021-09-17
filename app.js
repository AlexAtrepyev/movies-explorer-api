require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порте`));
