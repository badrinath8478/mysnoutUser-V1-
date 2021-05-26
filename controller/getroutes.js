const Hostel = require("../model/hosteldetails");
const hostelFeatures = require("../model/hostelFeatures");
const hostelPics = require("../model/pics");
const roomsAvailable = require("../model/roomsAvailable");

// code to get hostels around me
exports.hostelsAround = (req, res, next) => {
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
      $project: { _id: 1 ,dist:1},
    }
  ])
    .then(async (items) => {
      console.log(items);
      let Hostels = [];
      for (const item of items) {
        await Hostel.findById(item._id)
          .populate("hostelFeatures")
          .populate("hostelPics")
          .populate("roomsAvailable")
          .exec()
          .then((hostels) => {
            Hostels.push(hostels);
          });
      }
      return res
        .status(201)
        .json({ hostels: Hostels.length , success: Hostels });
    })
    .catch((err) => {
      console.log(err);
    });
};

//search hostels by cityname

exports.searchHostels = (req, res, next) => {
  const search = req.body.search;
  Hostel.aggregate([
    {
      $match: {
        $or: [
          { city: search },
          { area: search },
          { pincode: search },
          { state: search },
          { country: search },
        ],
      },
    },
    {
      $project: { _id: 1  ,dist:1},
    }
  ])
    .then(async (items) => {
      console.log(items);
      let Hostels = [];
      for (const item of items) {
        await Hostel.findById(item._id)
          .populate("hostelFeatures")
          .populate("hostelPics")
          .populate("roomsAvailable")
          .exec()
          .then((hostels) => {
            Hostels.push(hostels);
          });
      }
      return res.status(201).json({  hostels: Hostels.length,success: Hostels });
    })
    .catch((err) => {
      console.log(err);
    });
};

// code to get hostels around u
exports.hostelsNear = (req, res, next) => {
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
      $project: { _id: 1, dist: 1 },
    },
  ])
    .then(async (items) => {
      console.log(items);
      let Hostels = [];
      for (const item of items) {
        await Hostel.findById(item._id)
          .populate("hostelFeatures")
          .populate("hostelPics")
          .populate("roomsAvailable")
          .exec()
          .then((hostels) => {
            Hostels.push(hostels);
          });
      }
      return res.status(201).json({  hostels: Hostels.length,success: Hostels });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.hostelsWithin = (req, res, next) => {
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
      $project: { _id: 1  ,dist:1},
    },
  ])
    .then(async (items) => {
      console.log(items);
      let Hostels = [];
      for (const item of items) {
        await Hostel.findById(item._id)
          .populate("hostelFeatures")
          .populate("hostelPics")
          .populate("roomsAvailable")
          .exec()
          .then((hostels) => {
            Hostels.push(hostels);
          });
      }
      return res.status(201).json({  hostels: Hostels.length,success: Hostels });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.hostelsBeyond = (req, res, next) => {
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
      $project: { _id: 1  ,dist:1},
    },
  ])
    .then(async (items) => {
      console.log(items);
      let Hostels = [];
      for (const item of items) {
        await Hostel.findById(item._id)
          .populate("hostelFeatures")
          .populate("hostelPics")
          .populate("roomsAvailable")
          .exec()
          .then((hostels) => {
            Hostels.push(hostels);
          });
      }
      return res.status(201).json({ hostels: Hostels.length, success: Hostels });
    })
    .catch((err) => {
      console.log(err);
    });
};
