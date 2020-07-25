require('dotenv').config();
require('./connection.js');

const utils = require('./utils/utils.js');
const { findMemberByID } = require('./utils/crud/findMember.js');
const { saveDMtoDB } = require('./utils/crud/logDMmessagesToBot.js');
const { saveMessageInDB } = require('./utils/crud/logMessageInDB.js');
const { createNewMember } = require('./utils/crud/createNewMember.js');
const { checkIfSereverNameChanged } = require('./utils/crud/updateMember.js');
const { checkAndSaveMembers } = require('./libs/botFunctionalities/saveMemberToDB.js');
const { checkIsMsgContainAnInsult } = require('./libs/botFunctionalities/checkInsults.js');

const Discord = require('discord.js');

const client = new Discord.Client({ "presence": { "status": "online", "activity": { "name": "🍉 Code 🍉", type: "PLAYING" } } });

client.login(process.env.BOT_TOKEN);

client.on('ready', async () => {

    let serversWithBot = [];

    console.log(`Bot logged in as ${client.user.tag}!`);
    console.log(client.readyAt);
    //Show servers names where Bot is logged.
    client.guilds.cache.forEach(function (servidor) {
        serversWithBot.push({ "name": servidor.name, "id": servidor.id })
    });
    console.log(serversWithBot);
    //Check if a sever has changed name.
    for (let server of serversWithBot) {
        await checkIfSereverNameChanged(server.id, server.name);
    }
    //Save current data of users present on the servers at the time that Bot start.
    await checkAndSaveMembers(client);

});

client.on('guildMemberAdd', async function (userJoinedinServer) { // Users acces control at the server

    if (await findMemberByID(userJoinedinServer.id)) {
        userJoinedinServer.send(":robot: Bienvenid@ nuevamente al servidor. Me alegro de que hayas vuelto :grin:");
    } else {
        let usuarioNuevo = {
            "userID": userJoinedinServer.user.id,
            "uname": userJoinedinServer.user.tag,
            "servers": {
                "serverID": userJoinedinServer.guild.id,
                "server": userJoinedinServer.guild.name,
                "date": userJoinedinServer.joinedAt
            },
            "welcomestatus": true
        }
        //console.log(usuarioNuevo)
        await createNewMember(usuarioNuevo);
        userJoinedinServer.send(":robot: Bienvenid@ al servidor, soy HippoBot.");
    }

});

client.on('message', async function (msg) {
    //console.log(msg)

    /* console.log(client.guilds.cache.get("687660036520017936").members.cache.forEach((elemento)=>{
        console.log(elemento.user.username)
    })); */
    if (await checkIsMsgContainAnInsult(msg) && msg.channel.type != "dm") {
        await msg.delete();
        console.log("Se ha eliminado un mensaje que contenía un insulto");
    }

    if (msg.channel.type == "dm" && msg.content.toLocaleLowerCase().includes("!pokemon") == false) {
        try {
            await msg.author.send("Hola! estas intentando hablar con un Bot! :robot: bip bop bop bip");
            await saveDMtoDB(msg);
        }
        catch (err) {
            //console.log(err); //Aquí da un error del tipo httpStatus: 400 (De momento es ignorado porque funciona bien)
        }
    }

    if (msg.content.toLocaleLowerCase().startsWith("!pokemon") == true) {
        /* let usuario = msg.author;
        usuario.send("Así que te gustan los pokemons eh"); */
        let splitedMessageBySpaces = msg.content.split(" ");
        console.log(splitedMessageBySpaces);
        let numeroPoke = splitedMessageBySpaces[1];

        if (isNaN(numeroPoke) == false) { //Si la segunda posición del array es un número (isNaN == false)

            if (numeroPoke >= 1 && numeroPoke <= 151) {

                let pokemonData = await utils.getDataFromApi(numeroPoke);
                console.log(pokemonData);
                let archivoAdjunto = new Discord.MessageAttachment();
                msg.reply(pokemonData.name, archivoAdjunto.setFile(pokemonData.sprites.animated));
                //msg.reply(pokemonData.name, archivoAdjunto.setFile("https://www.pkparaiso.com/imagenes/xy/sprites/animados/" + pokemonData.name.toLowerCase() + ".gif"));
            } else {
                msg.reply("El número de pokemon debe estar entre 1 y 151");
            }
        } else {
            msg.reply("la sintaxis del comando es: !pokemon <número>");
        }
    }

});

client.on('messageDelete', async function (msg) {
    await saveMessageInDB(msg);
})