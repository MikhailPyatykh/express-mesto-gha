const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const errorStatus = require("./utils/errorsStatus");

const { PORT } = process.env;
const app = express();

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb");
  console.log("Connected to db");
  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();

app.use((req, res, next) => {
  req.user = {
    _id: "62e79d76b574b77a1da2fe01",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.all("*", (req, res) => {
  res
    .status(errorStatus.DATA_NOT_FOUND_CODE)
    .send({ message: "Переданы некорректные данные URL" });
});
