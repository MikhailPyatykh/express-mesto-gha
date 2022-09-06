const router = require("express").Router();

const {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

const {
  idValidation,
  userValidation,
  avatarValidation,
} = require("../middlewares/requestsValidation");

const { authorization } = require("../middlewares/authorization");

router.use(authorization);

router.get("/", getUsers);
router.get("/me", getUser);
router.get("/:userId", idValidation("userId"), getUserById);
router.patch("/me", userValidation, updateUser);
router.patch("/me/avatar", avatarValidation, updateAvatar);

module.exports = router;
