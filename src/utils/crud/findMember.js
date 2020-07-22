require('../../connection.js');
const Member = require('../../libs/models/ServerMebers.js');


async function findMemberByID(userID) {
    let user = await Member.findOne({ "userID": userID });
    if (user) {
        return user;
    } else {
        return false;
    }
}

function isInOtherServer(currentServers, posibleNewServerID) {
    for (let i = 0; i < currentServers.length; i++) {
        if (currentServers[i].serverID == posibleNewServerID) {
            return false;
        }
    }
    return true;
}

module.exports = { findMemberByID, isInOtherServer }