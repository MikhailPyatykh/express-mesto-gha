require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const error = require('./utils/errorsTemplate');

const { register, login } = require('./controllers/users');

const {
  registerValidation,
  loginValidation,
} = require('./middlewares/requestsValidation');

const { errorsHandler } = require('./middlewares/errorsHandler');

const PORT = 3000;

const app = express();

// Apply the rate limiting middleware to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());
app.use(express.json());

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  await app.listen(PORT);
}

main();

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signup', registerValidation, register);
app.post('/signin', loginValidation, login);

app.all('*', (req, res, next) => {
  next(error.DATA_NOT_FOUND('Такого URL не существует'));
});

app.use(errors());
app.use(errorsHandler);
