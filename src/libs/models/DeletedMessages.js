const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    username: String,
    userID: String,
    serverName: String,
    serverID: String,
    content: String,
    createdAt: Date,
});

module.exports = mongoose.model("deletedMessages", Message);