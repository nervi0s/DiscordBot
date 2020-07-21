require('../../connection.js');
const Member = require('../../libs/models/ServerMebers.js');


async function findMemberByID(id) {
    let user = await Member.findOne({ "userID": id });
    if (user) {
        return user;
    } else {
        return false;
    }
}

function isInOtherServer(currentsServers, posibleNewServerID) {
    let result = true;
    for (let i = 0; i < currentsServers.length; i++) {
        if (currentsServers[i].serverID == posibleNewServerID) {
            result = false;
        }
    }
    return result;
}

module.exports = { findMemberByID, isInOtherServer }