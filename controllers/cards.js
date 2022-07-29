const router = require("express").Router();
const Card = require("../models/card");

module.exports.getCards = router.get("/", (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
});

module.exports.createCard = router.post("/", (req, res) => {
  const { name, link, owner, likes, createdAt } = req.body;

  Card.create({ name, link, owner, likes, createdAt })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
});
