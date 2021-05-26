const express = require("express");
const router = express.Router();
const AuthController = require("../controller/auth");


const multer = require('multer');
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/files')
    },
    filename: function (req, file, cb) {

        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${Date.now()}.${extension}`)
    }
})
var upload = multer({ storage: storageEngine })




router.post("/login", AuthController.login);


router.post("/register", AuthController.userRegister);


router.post("/forgotPassword", AuthController.forgotPassword);


router.put("/resetPassword",  AuthController.resetPassword);


router.post("/verifyOtp", AuthController.verifyOtp);


router.post("/logOut", AuthController.logOut);


router.put("/updateProfile",upload.single("profilePic"),AuthController.updateProfile);


router.delete("/deleteProfilePic",AuthController.deleteProfilePic);




module.exports = router;


