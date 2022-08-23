const router = require("express").Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
