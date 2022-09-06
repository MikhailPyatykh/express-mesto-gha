require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const status = require("./utils/errors");

const { register, login } = require("./controllers/users");

const {
  registerValidation,
  loginValidation,
} = require("./middlewares/requestsValidation");

const { errors } = require("celebrate");

const { errorsHandler } = require("./middlewares/errorsHandler");

const { PORT } = process.env;

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
  await mongoose.connect("mongodb://localhost:27017/mestodb");
  console.log("Connected to db");
  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.post("/signup", registerValidation, register);
app.post("/signin", loginValidation, login);

app.all("*", (req, res) => {
  res
    .status(status.DATA_NOT_FOUND.statusCode)
    .send({ message: status.DATA_NOT_FOUND.message });
});

app.use(errors());
app.use(errorsHandler);
