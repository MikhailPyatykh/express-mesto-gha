const express = require("express");
const router = require("express").Router();
const Card = require("../models/card");

module.exports.getCards = router.get("/", (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
});

module.exports.createCard = router.post("/", express.json(), (req, res) => {
  const { name, link, owner } = req.body;
  console.log(req.user._id);

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then(
      console.log({
        name,
        link,
        owner,
      })
    )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message:
            "переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля",
        });
      } else {
        res.status(500).send({ message: "ошибка по-умолчанию" });
      }
    });
});
