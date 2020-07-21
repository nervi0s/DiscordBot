require('dotenv').config();
require('./connection.js');

const utils = require('./utils/utils.js');
const { createNewMember } = require('./utils/crud/createNewMembers.js');
const { findMemberByID, isInOtherServer } = require('./utils/crud/findMembers.js');
const { updateMemberName, updateMemberServer, checkIfSereverNameChanged } = require('./utils/crud/updateMember.js');

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
        await checkIfSereverNameChanged(server.id, server.name)
    }

    //Save current data of users present on the servers at the time that Bot start.
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

                if (isInOtherServer(isOldMember.servers, miembro[1].guild.id)) { // Si existe el usuario pero está en un server diferente

                    let docServer = {
                        "serverID": miembro[1].guild.id,
                        "serverName": miembro[1].guild.name,
                        "joinedAt": miembro[1].joinedAt
                    }

                    await updateMemberServer(isOldMember.userID, docServer) // entonces añadimos ese server.
                }



            } else { // Si no tenemos a este usuruario, lo añadimos a la DB.
                userData = {
                    "userID": miembro[1].user.id,
                    "uname": miembro[1].user.tag,
                    "servers": {
                        "serverID": miembro[1].guild.id,
                        "server": miembro[1].guild.name,
                        "date": miembro[1].joinedAt
                    }
                }
                //console.log(userData);
                await createNewMember(userData);
            }
        }

    }
    /* client.guilds.cache.forEach(async (servidor) => {
        // Async - await no funciona bien en los forEach, por eso se usó arriba un for normal para
        // precorrer los mapas
    }); */
});

client.on('guildMemberAdd', async function (userJoinedinServer) { //Control de entrada de usuarios en el server

    if (await findMemberByID(userJoinedinServer.id)) {
        userJoinedinServer.send(":robot: Bienvenid@ nuevamente al servidor. Me alegro de que hayas vuelto :grin:");
    } else {
        let usuarioNuevo = {
            "userID": userJoinedinServer.user.id,
            "uname": userJoinedinServer.user.tag,
            "server": userJoinedinServer.guild.name,
            "date": userJoinedinServer.joinedAt,
            "welcomestatus": true
        }
        //console.log(usuarioNuevo)
        await createNewMember(usuarioNuevo);
        userJoinedinServer.send(":robot: Bienvenid@ al servidor, soy HippoBot.");
    }

});

/* client.on('messageDelete',function (msg){
    console.log(msg.content)
}) */

client.on('message', async function (msg) {
    /* console.log(client.guilds.cache.get("687660036520017936").members.cache.forEach((elemento)=>{
        console.log(elemento.user.username)
    })); */

    if (msg.content == "kk" && msg.channel.type != "dm") { //[toDo]hacer archivos con los mensajes elimninados
        msg.delete();
        console.log("Se ha eliminado un mensaje")
    }

    //console.log(msg)

    if (msg.channel.type == "dm" && msg.content.toLocaleLowerCase().includes("!pokemon") == false) {
        try {
            await msg.author.send("Esto es es un mensaje directo de un bot si le mandas un DM")
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