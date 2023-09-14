const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    authorId:{type: 'string', required: true},
    name: { type: String, unique: true, required: true },
    art: { type:String, ref: 'Art' },
    group: [{ type: String, ref: 'GroupType', required: true }],
    tags: [{ type: String }],
    content: { type: String, required: true },
    illustration: [{ type: String, required: false }],
    authorRate: { type: Number, ref: 'Art', min: 1, max: 10 },
});

module.exports = mongoose.model('Review', reviewSchema);
