const mongoose = require("mongoose");
const Hostel = require("../model/hosteldetails");
const LikedHostels = require("../model/likedHostels");
const tenant = require("../model/tenant");


//code to add a liked hostel to an array
exports.liked = (req, res, next) => {
  const hostel = req.params.hostelId;
  tenant
    .findById(req.tenantId, (err, result) => {
      if (!result.likedHostelsId) {
        const likedHostels = new LikedHostels({
          _id: new mongoose.Types.ObjectId(),
          likedHostels: hostel,
          tenantId: req.tenantId,
        });
        return likedHostels.save().then((like) => {
          tenant.findById(req.tenantId, (err, result) => {
            if (result) {
              result.likedHostelsId = like._id;
              result.save();
              return res.status(201).json({ success: result });
            }
          });
        });
      } else {
        LikedHostels.findOne({ _id: result.likedHostelsId }, (err, result) => {
          if (result.likedHostels.includes(hostel) === false) {
            result.likedHostels.push(hostel);
            result.save();
            
            return res.status(201).json({ success: result.likedHostels });
          } else {
            return res.status(500).json({ error: process.env.EXIST });
          }
        });
      }
    })
    .then((result) => {
      Hostel.findById(hostel, (err, theUser) => {
        if (theUser) {
          theUser.likes += 1;
          theUser.save();
        }
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};


// code to get all liked hostels 
exports.likedHostel = (req, res, next) => {
  tenant.findById(req.tenantId, (err, result) => {
    if (result) {
      LikedHostels.findById(result.likedHostelsId)
        .then(async (items) => {
          let Hostels = [];
          for (const item of items.likedHostels) {
            await Hostel.findById(item._id)
            .select(
              "_id hostelname hosteladress hostelPics hostelmobilenumber location likes"
            )
            .populate("hostelPics", { hostelImages: 1, _id: 0 })
              .exec()
              .then((hostels) => {
                Hostels.push(hostels);
              });
          }
          return res
            .status(201)
            .json({ hostels: Hostels.length, success: Hostels });
        })
        .catch((err) => {
          return res.status(500).json({ error: err });
        });
    }
  });
};


// code to remove a single liked hostels 
exports.removeHostel = (req, res, next) => {
  const hostelId = req.params.hostelId;
  tenant.findById(req.tenantId, (err, result) => {
    if(result){
      LikedHostels.findById(result.likedHostelsId)
      .then((items) => {
        const indexValue = items.likedHostels.indexOf(hostelId);
        items.likedHostels.splice(indexValue,1);
        items.save();
        return res.status(201).json({  success:process.env.REMOVED });
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });
    }
  });
};
