const mongoose = require("mongoose");
const Tenant = require("../model/tenant");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomize = require("randomatic");
const jwt = require("jsonwebtoken");

var transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_PASSWORD,
  },
});


//code to register an account
exports.userRegister = (req, res, next) => {
  const { fullName, email, password, mobileNumber } = req.body;
  const otp = randomize("0", 6);
  Tenant.findOne({ email: email })
    .exec()
    .then((tenant) => {
      if (tenant) {
        return res.status(500).json({ error: process.env.MAIL_EXISTS });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const tenant = new Tenant({
              _id: new mongoose.Types.ObjectId(),
              fullName: fullName,
              email: email,
              mobileNumber: mobileNumber,
              password: hash,
              OTP :otp,
              otpExpire : Date.now() + 3600
            });
            return tenant
              .save()
              .then((result) => {
                console.log(result);
                let mailOptions = {
                  from: process.env.MY_MAIL,
                  to: email,
                  subject: process.env.LOGIN,
                  text: `Hi there , to login into your 'MY-SNOUT' account here is the OTP  "${otp}". \n This otp expires in 10 minutes `,
                };
                transporter.sendMail(mailOptions, (err) => {
                  if (err) {
                    return res.status(500).json({ error: err });
                  }
                  
                });
                return res
                  .status(201)
                  .json({
                    success: process.env.REGISTERED_SUCCESSFULLY,
                    hostel: result._id,
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          }
        });
      }
    });
};

//code to login into an account
exports.login = (req, res, next) => {
  const { email, password } = req.body;
  Tenant.findOne({ email: email })
    .exec()
    .then((tenant) => {
      if (!tenant) {
        return res
          .status(500)
          .json({ error: process.env.EMAIL_NOT_REGISTERED });
      } ;
      if(tenant.isVerified === true) {
        bcrypt.compare(password, tenant.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                tenantId: tenant._id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "15d",
              }
            );
            return res
              .status(201)
              .json({ success: process.env.SUCCESS, token: token });
          } else {
            return res
              .status(500)
              .json({ error: process.env.INCORRECT_PASSWORD });
          }
        });
      } else {
        res.status(500).json({ error: process.env.GET_VERIFIED });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

//code to verifyOtp
exports.verifyOtp = (req, res, next) => {
  compareOtp = req.body.otp;
  Tenant.findByIdAndUpdate({
    _id: req.params.tenantId,
    otpExpire: { $gt: Date.now() },
  })
    .then((tenant) => {
      
      if (tenant.OTP === compareOtp) {
        tenant.OTP = null;
        tenant.otpExpire = null;
        tenant.isVerified = true;
        tenant.save();
        return res.status(201).json({ success: process.env.OTP_VERIFIED });
      } else {
        return res
          .status(500)
          .json({ error: process.env.OTP_INCORRECT_EXPIRED });
      }
    })
    .catch((err) => {
      
      res.status(500).json({ error: err });
    });
};

//code to forgot password
exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  Tenant.findOne({ email: email })
    .exec()
    .then((tenant) => {
      const otp = randomize("0", 6);
      if (otp) {
        let mailOptions = {
          from: process.env.MY_MAIL,
          to: email,
          subject: process.env.FORGOT_OTP,
          text: process.env.RESET_PASSWORD + otp,
        };
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          
        });
        tenant.OTP = otp;
        tenant.otpExpire = Date.now() + 3600;
        tenant.isVerified = false;
        return tenant.save();
      }
    })
    .then((result) => {
      return res.status(201).json({success: process.env.MAIL_SENT, tenantId: result._id });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

//code to reset password
exports.resetPassword = (req, res, next) => {
  const { password, confirm } = req.body;
  Tenant.findByIdAndUpdate(req.params.tenantId).then((tenant) => {
    if (!tenant) {
      return res
        .status(500)
        .json({ message: process.env.EMAIL_NOT_REGISTERED });
    } ;
    if (tenant.isVerified === true) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        if (password === confirm) {
          tenant.password = hash;
          tenant.OTP = null;
          tenant.otpExpires = null;
          tenant.save();
        }
        let mailOptions = {
          from: process.env.MY_MAIL,
          to: tenant.email,
          subject: process.env.RESET,
          text: process.env.PASSWORD_RESET_SUCCESS,
        };
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            return res.status(201).json({ success: process.env.PASSWORD_RESET });
          }
        });
      });
    } else {
      return res.status(500).json({ error: process.env.GET_VERIFIED_TO_RESETPASSWORD });
    }
  })
  .catch((err) => {
    return res.status(500).json({ error: err });
  });
};

//code to logout
exports.logOut = (req, res, next) => {

};

//code to update profile page
exports.updateProfile = (req, res, next) => {
  Tenant.findOne({ _id: req.tenantId })
    .then((post) => {
      post.fullName = req.body.fullName;
      post.mobileNumber = req.body.mobileNumber;
      post.profilePic = req.file.path;
      return post.save();
    })
    .then((result) => {
      res.status(201).json({ success: process.env.POST_UPDATED });
    })
    .catch((err) => {
      
      res.status(500).json({ error: err });
    });
};

// code to delete profilepic
exports.deleteProfilePic = (req, res, next) => {
  Tenant.findOne({ _id: req.tenantId })
    .then((post) => {
      post.profilePic = null;
      return post.save();
    })
    .then((result) => {
      res.status(201).json({ success: process.env.POST_UPDATED });
    })
    .catch((err) => {
      
      res.status(500).json({ error: err });
    });
};
