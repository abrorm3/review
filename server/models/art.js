const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const artSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    type: { type: String, ref: 'GroupType', required: true },
    author:{type:String, required: false},
    director:{type:String, required: false},
});

module.exports = mongoose.model('Art', artSchema);
