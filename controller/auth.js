const mongoose = require("mongoose");
const Tenant = require("../model/tenant");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const randomize = require('randomatic');



var transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASSWORD
    }
});



exports.userRegister = (req, res, next) => {
    const { fullName, email, password, mobileNumber } = req.body;
    Tenant.findOne({ email: email }).exec().then(tenant => {
        if (tenant) {
            return res.status(500).json({ message: process.env.MAIL_EXISTS });
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
                        password: hash
                    });
                    return tenant.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({ message: process.env.REGISTERED_SUCCESSFULLY });
                            let mailOptions = {
                                from: process.env.MY_MAIL,
                                to: email,
                                subject: process.env.GREETINGS,
                                text: process.env.REGISTERED
                            };
                            return transporter.sendMail(mailOptions, err => {
                                if (err) throw err;
                                console.log(process.env.MAIL_SENT);
                            });
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err })
                        });
                }
            });
        }
    })
};



exports.login = (req, res, next) => {
    const { email, password } = req.body;
    const otp = randomize('0', 6);
    Tenant.findOne({ email: email }).exec().then(tenant => {
        if (!tenant) {
            return res.status(500).json({ message: process.env.EMAIL_NOT_REGISTERED });
        } else {
            tenant.OTP = otp;
            tenant.otpExpire = Date.now() + 600;
            tenant.save();
            req.session.tenant = tenant;
        }
        return bcrypt.compare(password, tenant.password)
    }).then(result => {
            let mailOptions = {
                from: process.env.MY_MAIL,
                to: email,
                subject: process.env.LOGIN,
                text: `Hi there , to login into your 'MY-SNOUT' account here is the OTP  "${otp}". \n This otp expires in 10 minutes `
            };
            transporter.sendMail(mailOptions, err => {
                if (err) throw err;
                console.log(process.env.MAIL_SENT);
            });
            if (result) {
                return res.status(201).json({ success: process.env.SUCCESS });
            } else {
                return res.status(500).json({ message: process.env.INCORRECT_PASSWORD });
            }
        }).catch(err => {
            console.log(err);
        });
};



exports.verifyOtp = (req, res, next) => {
    compareOtp = req.body.otp;
    Tenant.findById({ _id: req.session.tenant._id, otpExpire: { $gt: Date.now() } })
        .then(tenant => {
            if (tenant.OTP === compareOtp) {
                tenant.OTP = null;
                tenant.otpExpire = null;
                return res.status(201).json({ message: process.env.OTP_VERIFIED });
            }
            else {
                return res.status(500).json({ message: process.env.OTP_INCORRECT_EXPIRED });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};




exports.forgotPassword = (req, res, next) => {
    const { email } = req.body;
    Tenant.findOne({ email: email }).exec().then(tenant => {
        const otp = randomize('0', 6);
        if (otp) {
            let mailOptions = {
                from: process.env.MY_MAIL,
                to: email,
                subject: process.env.FORGOT_OTP,
                text: process.env.RESET_PASSWORD + otp
            };
            transporter.sendMail(mailOptions, err => {
                if (err) throw err;
                console.log(process.env.MAIL_SENT);
            });
            tenant.OTP = otp;
            tenant.otpExpire = Date.now() + 3600;
            tenant.save();
            return res.status(201).json({ message: tenant });
        }
    }).catch(err => {
        console.log(err);
    });

};




exports.resetPassword = (req, res, next) => {
    const { password, confirm } = req.body;
    Tenant.findByIdAndUpdate({email: req.session.tenant.email}).then(tenant => {
        if (!tenant) {
            return res.status(500).json({ message: process.env.EMAIL_NOT_REGISTERED });

        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                if (password === confirm) {
                    tenant.password = hash;
                    tenant.OTP = null;
                    tenant.otpExpires = null;
                    res.status(201).json({ message:process.env.SUCCES  });
                    tenant.save();
                }
                let mailOptions = {
                    from: process.env.MY_MAIL,
                    to: tenant.email,
                    subject: process.env.RESET,
                    text: process.env.PASSWORD_RESET_SUCCESS
                };
                return transporter.sendMail(mailOptions, err => {
                    if (err) throw err;
                    console.log(process.env.MAIL_SENT);
                });

            })
        }
    })

};



exports.logOut = (req, res, next) => {
    req.session.destroy((err) => {
      if(err){
        res.status(500).json({message:process.env.SESSION_ERR});
    }else{
        res.status(201).json({message:process.env.SESSION_DESTROYED});
    }
    });
  };
  


  exports.updateProfile = (req, res, next) => {
    Tenant.findOne({ email: req.session.tenant.email })
      .then((post) => {
        post.fullName = req.body.fullName;
  
        post.mobileNumber = req.body.mobileNumber;
  
        post.profilePic = req.file.path;
  
        return post.save();
      })
      .then((result) => {
        res.status(201).json({ message: process.env.POST_UPDATED });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  };
  
  
  exports.deleteProfilePic = (req,res,next) => {
    
  }



