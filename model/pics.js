
const mongoose = require('mongoose');



const imageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hostelImages: {},
    kitchenPics:{},
    menuPics: {}
});

module.exports = mongoose.model('Pics', imageSchema);


