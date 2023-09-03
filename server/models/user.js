const { Schema, model } = require('mongoose');

const User = new Schema({
    name:{type: String, default:''},
    email: { type: String, unique: true, required: true },
    aboutUser:{ type: String, default: ''},
    profilePictureUrl: { type: String, default:''},
    username: {type: String, required: true},
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }],
    lastLoginTime: { type: Date, default: null },
    registrationTime: { type: Date, default: null },
});

module.exports = model('User', User);