const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DmMessage = new Schema({
    username: String,
    userID: String,
    content: String,
    createdAt: Date,
});

module.exports = mongoose.model("privateMsgToBot", DmMessage);