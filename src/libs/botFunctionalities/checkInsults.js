const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

async function checkIsMsgContainAnInsult(msg) {
    let insultList = [];
    let mensaje = msg.content.toLowerCase();

    try {
        insultList = (await readFilePromise('./libs/botFunctionalities/diccionario.txt', "utf8")).split("\r\n");
        //console.log(insultList);
    } catch (err) {
        console.log(err);
    }

    for (let insulto of insultList) {
        // console.log(mensaje.includes(insulto.toLowerCase()), insulto.toLowerCase())
        if (mensaje.includes(insulto.toLowerCase())) {
            return true;
        }
    }

    return false;
}

module.exports = { checkIsMsgContainAnInsult }