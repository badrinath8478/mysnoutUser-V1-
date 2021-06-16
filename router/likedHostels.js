const express = require("express");
const router = express.Router();
const LikeController = require("../controller/likedHostels");
const isAuth = require("../middleware/auth");




router.post("/like/:hostelId",isAuth, LikeController.liked);

router.get("/likedHostels",isAuth,LikeController.likedHostel);

router.delete("/likedHostels/:hostelId",isAuth,LikeController.removeHostel);

module.exports = router;

