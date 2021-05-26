const mongoose = require('mongoose');


const hostelFeaturesSchema = mongoose.Schema({
    charges: {type: [String], require: true},
    ammentis: {type: [String], require: true},
    hostelPrefferedFor: {type: [String], require: true},
    hostelAvailableFor: {type: [String], require: true},
    cleaningServices: {type: [String], require: true},
    security: {type: [String], require: true},
    homeRules: {type: [String], require: true},
    facilities: {type: [String], require: true},
    customFacilities: { type: String }
});



module.exports = mongoose.model('HostelFeatures', hostelFeaturesSchema);
