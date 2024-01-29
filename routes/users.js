var express = require("express");
const { authLogin, getUserData } = require("../controller/user.controller");
const { authMiddleware } = require("../utils/tokenValidator");
var router = express.Router();

/* userlogin */
router.post("/login", authLogin);
router.get("/userData", authMiddleware, getUserData);

module.exports = router;
