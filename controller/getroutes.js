const Hostel = require("../model/hosteldetails");
const hostelFeatures = require("../model/hostelFeatures");
const hostelPics = require("../model/pics");
const roomsAvailable = require("../model/roomsAvailable");

// code to get hostels around 0km to 100km
exports.hostelsAround = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const lng = req.params.lng;
  const lat = req.params.lat;
  Hostel.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng * 1, lat * 1] },
        minDistance: 1 * 1000,
        maxDistance: 100 * 1000,
        distanceMultiplier: 1 / 1000,
        distanceField: "dist",
        spherical: true,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: 10,
    },
    {
      $project: { _id: 1 },
    },
  ])
    .then(async (items) => {
      let Hostels = [];
      for (const item of items) {
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
      return res.status(201).json({
        hostels: Hostels.length,
        success: Hostels,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

// code to get hostels around 0km to 25km
exports.hostelsNear = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const lng = req.params.lng;
  const lat = req.params.lat;
  Hostel.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng * 1, lat * 1] },
        minDistance: 1 * 1000,
        maxDistance: 25 * 1000, // in km
        distanceMultiplier: 1 / 1000,
        distanceField: "dist",
        spherical: true,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: 10,
    },
    {
      $project: { _id: 1 },
    },
  ])
    .then(async (items) => {
      let Hostels = [];
      for (const item of items) {
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
};

// code to get hostels around 25km to 50km
exports.hostelsWithin = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const lng = req.params.lng;
  const lat = req.params.lat;
  Hostel.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng * 1, lat * 1] },
        minDistance: 25 * 1000,
        maxDistance: 50 * 1000, // in km
        distanceMultiplier: 1 / 1000,
        distanceField: "dist",
        spherical: true,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: 10,
    },
    {
      $project: { _id: 1 },
    },
  ])
    .then(async (items) => {
      let Hostels = [];
      for (const item of items) {
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
};

// code to get hostels around 50km to 100km
exports.hostelsBeyond = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const lng = req.params.lng;
  const lat = req.params.lat;
  Hostel.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng * 1, lat * 1] },
        minDistance: 50 * 1000,
        maxDistance: 100 * 1000, // in km
        distanceMultiplier: 1 / 1000,
        distanceField: "dist",
        spherical: true,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: 10,
    },
    {
      $project: { _id: 1 },
    },
  ])
    .then(async (items) => {
      let Hostels = [];
      for (const item of items) {
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
};

//search hostels by cityname,area,pincode,state,country
exports.searchHostels = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const search = String(req.body.search);
  Hostel.aggregate([
    {
      $match: {
        $or: [
          { "location.city": search },
          { "location.area": search },
          { "location.pincode": search },
          { "location.state": search },
          { "location.country": search },
        ],
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: 10,
    },
    {
      $project: { _id: 1 },
    },
  ])
    .then(async (items) => {
      let Hostels = [];
      for (const item of items) {
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
};

// code to get a single hostel using hostelId
exports.hostel = (req, res, next) => {
  const hostelId = req.params.hostelId;
  Hostel.findById(hostelId)
    .populate("hostelFeatures")
    .populate("hostelPics")
    .populate("roomsAvailable")
    .exec()
    .then((hostel) => {
      return res.status(201).json({ success: hostel });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

// code to get hostels by using search by filter
exports.filter = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const gte = parseInt(req.body.gte) || 0;
  const lte = parseInt(req.body.lte) || 100000;
  const gender = req.body.gender;
  const roomType = req.body.roomType;

  Hostel.aggregate([
    {
      $lookup: {
        from: "roomsavailables",
        localField: "roomsAvailable",
        foreignField: "_id",
        as: "hostelRooms",
      },
    },
    {
      $lookup: {
        from: "hostelfeatures",
        localField: "hostelFeatures",
        foreignField: "_id",
        as: "hostelfeatures",
      },
    },
    {
      $unwind: "$hostelRooms",
    },
    {
      $unwind: "$hostelRooms.rooms",
    },
    {
      $unwind: "$hostelfeatures",
    },
    {
      $unwind: "$hostelfeatures.hostelAvailableFor",
    },
    {
      $match: {
        $and: [
          { "hostelfeatures.hostelAvailableFor": gender },
          { "hostelRooms.rooms.roomType": roomType },
          { "hostelRooms.rooms.price": { $gte: gte, $lte: lte } },
        ],
      },
    },
    {
      $group: { _id: "$_id" },
    },
    {
      $skip: skip,
    },
    {
      $limit: 10,
    },
  ])
    .then(async (items) => {
      let Hostels = [];
      for (const item of items) {
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
};
