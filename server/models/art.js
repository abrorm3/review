const { Schema, model } = require('mongoose');

const artSchema = new Schema({
    title: { type: String, required: true },
    type: { type: Schema.Types.ObjectId, ref: 'GroupType', required: true },
    author:{type:String, required: false},
    director:{type:String, required: false},
});

module.exports = model('Art', artSchema);
