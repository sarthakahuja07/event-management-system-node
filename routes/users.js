var express = require("express");
var router = express.Router();
const { getUserList, getUserById } = require("../controllers/user");


/* GET users listing. */
router.route("/").get(getUserList);
router.route("/:id").get(getUserById);

module.exports = router;
