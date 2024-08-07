import express from "express";

const UserController = require("../controllers/User");
const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
