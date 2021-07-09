const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: String
    },
    avatar: {
        type: String
    },
    text: {
        type: String
    },
    date: {
        type: Date
    }
},
    {
        versionKey: false
    });

module.exports = mongoose.model('messages', messageSchema);