const express = require("express");
const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.post("/", express.json(), createUser);
router.get("/:userId", express.json(), getUserById);
router.patch("/me", express.json(), updateUser);
router.patch("/me/avatar", express.json(), updateAvatar);

module.exports = router;
