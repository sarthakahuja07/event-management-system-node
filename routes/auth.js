var express = require("express");
var router = express.Router();

const {
	verifyToken,
	verifyTokenAndAuthorization
} = require("../middlewares/authenticate");
const {
	registerUser,
	loginUser,
	changePassword,
	logoutUser
} = require("../controllers/auth");

/* GET users listing. */
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/change-password").post(verifyToken,changePassword);
router.route("/logout").post(verifyToken,logoutUser);

module.exports = router;
