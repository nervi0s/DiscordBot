const { createNewMember } = require('../../utils/crud/createNewMember.js');
const { findMemberByID, isInOtherServer } = require('../../utils/crud/findMember.js');
const { updateMemberName, updateMemberServer } = require('../../utils/crud/updateMember.js');

async function checkAndSaveMembers(client) {
    let userData;

    for (let servidor of client.guilds.cache) {

        for (let miembro of servidor[1].members.cache) {

            console.log(miembro[1].user.id);

            let isOldMember = await findMemberByID(miembro[1].user.id);
            //console.log(isOldMember);
            if (isOldMember) { // Si ya tenemos registrado a este usuario en la DB

                if (!isOldMember.username.includes(miembro[1].user.tag)) { // y se ha cambiado de nick, añadimos su nuevo nick.
                    await updateMemberName(miembro[1].user.id, miembro[1].user.tag);
                }

                if (isInOtherServer(isOldMember.servers, miembro[1].guild.id)) { // si está en un server diferente.
                    let infoServer = {
                        "serverID": miembro[1].guild.id,
                        "serverName": miembro[1].guild.name,
                        "joinedAt": miembro[1].joinedAt
                    };
                    await updateMemberServer(isOldMember.userID, infoServer); // entonces añadimos ese server a los datos del usuario.
                }

            }
            else { // Si no tenemos a este usuruario, lo añadimos a la DB.

                userData = {
                    "userID": miembro[1].user.id,
                    "uname": miembro[1].user.tag,
                    "servers": {
                        "serverID": miembro[1].guild.id,
                        "server": miembro[1].guild.name,
                        "date": miembro[1].joinedAt
                    }
                };
                await createNewMember(userData);
            }
        }
    }
    /* client.guilds.cache.forEach(async (servidor) => {
        // Async - await no funciona bien en los forEach, por eso se usó arriba un for normal para
        // recorrer los mapas
    }); */
}

module.exports = { checkAndSaveMembers }
