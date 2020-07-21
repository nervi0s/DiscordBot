require('../../connection.js');
const Member = require('../../libs/models/ServerMebers.js');


async function createNewMember(objMember) {
    //console.log(objMember)
    let member = new Member({
        "userID": objMember.userID,
        "username": objMember.uname,
        "servers": {
            "serverID": objMember.servers.serverID,
            "serverName": objMember.servers.server,
            "joinedAt": objMember.servers.date,
        },
        "welcomeStatus": objMember.welcomestatus
    });

    try {
        await member.save();
        console.log(`Nuevo usuario: ${member.username} añadido a la DB.`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { createNewMember }