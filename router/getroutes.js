const express = require("express");
const router = express.Router();
const GetController = require("../controller/getroutes");





router.get("/hostelsAround/:lat/:lng", GetController.hostelsAround);


router.get("/hostelsNear/:lat/:lng", GetController.hostelsNear);


router.get("/hostelsWithin/:lat/:lng", GetController.hostelsWithin);


router.get("/hostelsBeyond/:lat/:lng", GetController.hostelsBeyond);


router.get("/searchHostels", GetController.searchHostels);




module.exports = router;

