const { Schema, model } = require('mongoose');

const groupTypeSchema = new Schema({
    name: { type: String, unique: true, required: true }
});

module.exports = model('GroupType', groupTypeSchema);
