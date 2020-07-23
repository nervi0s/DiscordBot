const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

async function checkIsMsgContainAnInsult(msg) {
    let insultList = [];
    let mensaje = msg.content.toLowerCase();
    try {
        insultList = (await readFilePromise('./libs/botFunctionalities/diccionario.txt', "utf8")).split("\n");
        //console.log(insultList);
    } catch (err) {
        console.log(err);
    }
    console.log(mensaje, 11111)
    let check = insultList[0].toLowerCase();
    console.log(check)
    console.log(mensaje.includes(check))
    for (let insulto of insultList) {
        //console.log(insulto.toLowerCase())
        console.log(mensaje.includes(insulto.toLowerCase()), insulto.toLowerCase())
        if (mensaje.includes(insulto.toLowerCase())) {
            msg.delete();
            console.log("Se ha eliminado un mensaje")
        }
    }
}

module.exports = { checkIsMsgContainAnInsult }