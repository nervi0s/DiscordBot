require('../../connection.js');
const Member = require('../../libs/models/ServerMebers.js');


async function findMemberByID(id) {
    let user = await Member.findOne({ "userID": id });
    if (user) {
        return true;
    } else {
        return false;
    }
}

module.exports = { findMemberByID }