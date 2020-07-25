require('../../connection.js');
const Message = require('../../libs/models/DeletedMessages.js');

async function saveMessageInDB(msg) {
    
    let mensaje = new Message({
        username: msg.author.tag,
        userID: msg.author.id,
        serverName: msg.guild.name,
        serverID: msg.guild.id,
        content: msg.content,
        createdAt: msg.createdAt

    });

    try {
        await mensaje.save();
        console.log("Se ha guardado un msg eliminado en la DB");
    } catch (err) {
        console.log(err);
    }
}

module.exports = { saveMessageInDB }