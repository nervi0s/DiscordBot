require('../../connection.js');
const DMmessage = require('../../libs/models/DMtoBot.js');

async function saveDMtoDB(msg) {

    let mensajePrivado = new DMmessage({
        username: msg.author.tag,
        userID: msg.author.id,
        content: msg.content,
        createdAt: msg.createdAt
    });

    try {
        await mensajePrivado.save();
        console.log("Se ha guardado un DM al bot en la DB");
    } catch (err) {
        console.log(err);
    }
}

module.exports = { saveDMtoDB }