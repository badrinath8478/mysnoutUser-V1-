const express = require("express");
const router = express.Router();
const AuthController = require("../controller/auth");



router.post("/login", AuthController.login);


router.post("/register", AuthController.userRegister);


router.post("/forgotPassword", AuthController.forgotPassword);


router.put("/resetPassword",  AuthController.resetPassword);


router.post("/verifyOtp", AuthController.verifyOtp);

router.post("/logOut", AuthController.logOut);


module.exports = router;


