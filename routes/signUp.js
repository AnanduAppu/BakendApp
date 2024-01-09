const express = require('express');
const router = express();
const {userRgistration} = require("../controller/userSignUp");

router.route("/signup").post(userRgistration);

module.exports = router;