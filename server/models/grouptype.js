const mongoose = require('mongoose');


const groupTypeSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('GroupType', groupTypeSchema);
