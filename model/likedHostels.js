
const mongoose = require('mongoose');



const likedHostelsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    likedHostels:[{type: mongoose.Schema.Types.ObjectId,
        ref: "Hosteldetails"}],
    tenantId :{type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant"}

   
});

module.exports = mongoose.model('LikedHostels', likedHostelsSchema);


