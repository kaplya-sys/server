const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: 'uploads/default_avatar.png'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);