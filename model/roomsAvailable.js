const mongoose = require("mongoose");

const roomsAvailableSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rooms: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      peoplePerRoom: { type: Number, require: true },
      name: { type: String, require: true },
      roomType: { type: String, require: true },
      price: { type: Number, require: true },
      roomsAvailable: { type: Number, require: true },
      roomSize: { type: Number, require: true },
      washroomsPerRoom: { type: Number, require: true },
    },
  ],
});

module.exports = mongoose.model("RoomsAvailable", roomsAvailableSchema);
