const mongoose = require("mongoose");

const hostelSchema = mongoose.Schema({
  __id: mongoose.Schema.Types.ObjectId,
  hostelname: { type: String, required: true, minlength: 5, maxlength: 30 },
  hostelmobilenumber: {
    type: [String],
    required: true,
    trim: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
    match: /[0-9]*/,
  },
  wardenname: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  estbyear: { type: Number, required: true },
  noOfFloors: { type: Number, required: true },

  location: {
    // type: { type: String, default: "Point" },
    
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    
    area: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },

  hosteladress: { type: String, required: true },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  hostelFeatures: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelFeatures",
  },
  hostelPics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pics",
  },
  roomsAvailable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomsAvailable",
  },
  createdOn: { type: Date, default: Date.now },
});


hostelSchema.index({location:'2dsphere'});

module.exports = mongoose.model("Hosteldetails", hostelSchema);
