const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembersData = new Schema({
    "userID": String,
    "username": String,
    "serverName": String,
    "joinedAt": Date,
    "welcomeStatus": {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('members', MembersData);