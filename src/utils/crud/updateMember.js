require('../../connection.js');
const Member = require('../../libs/models/ServerMebers.js');


async function updateMemberName(userID, newName) {
    let documento = await Member.findOne({ "userID": userID });
    console.log(documento, `Ha cambiado de nombre a: ${newName}`);
    documento.username.push(newName);
    try {
        await documento.save();
        console.log(documento)
    } catch (err) {
        console.log(err);
    }
}

async function updateMemberServer(userID, infoServer) {
    let documento = await Member.findOne({ "userID": userID });
    console.log(documento, `Se ha añadido un servidor al usuario, nombre del server: ${infoServer.serverName}`);
    documento.servers.push(infoServer);
    try {
        await documento.save();
        console.log(documento)
    } catch (err) {
        console.log(err);
    }
}

async function checkIfSereverNameChanged(idSever, possibleNewServerName) {

    let arrayDocs = await Member.find({ "servers.serverID": idSever });
    //console.log(arrayDocs,arrayDocs.length)
    for (let docu of arrayDocs) {
        for (let server of docu.servers) {
            //console.log(server)
            if (server.serverID == idSever) {

                if (!server.serverName.includes(possibleNewServerName)) {

                    console.log(server.serverName[server.serverName.length - 1], `--> Este servidor ha cambiado de nombre a: ${possibleNewServerName}`);
                    server.serverName.push(possibleNewServerName);

                    try {
                        await docu.save();
                        //console.log(docu)
                        console.log(`Se ha añadido el nuevo nombre a la DB, miembro: ${docu.username[docu.username.length - 1]} actualizado`)
                    } catch (err) {
                        console.log(err);
                    }

                }
            }
        }
    }
}

module.exports = { updateMemberName, updateMemberServer, checkIfSereverNameChanged }