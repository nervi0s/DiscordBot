require('dotenv').config();

const Usuario = require('./libs/clase_Usuario.js');
const utils = require('./utils/utils.js')
const Discord = require('discord.js');


let arrayWithMembersFileNames = [];

const client = new Discord.Client({ "presence": { "status": "online" } });

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}!`);
    console.log(client.readyAt)
});

client.on('guildMemberAdd', async function (userJoinedinServer) { //Control de entrada de usuarios en el server

    arrayWithMembersFileNames = await utils.readDir("../data/members");

    if (await utils.isOldMember(arrayWithMembersFileNames, userJoinedinServer.id) == true) {
        userJoinedinServer.send(":robot: Bienvenid@ nuevamente al servidor. Me alegro de que hayas vuelto :grin:");
    } else {
        let usuarioNuevo = new Usuario(userJoinedinServer.user.id, userJoinedinServer.user.tag, userJoinedinServer.guild.name, userJoinedinServer.joinedAt)
        userJoinedinServer.send(":robot: Bienvenid@ al servidor, soy HippoBot.");
        usuarioNuevo.setWelcomeStatus("true");
        await utils.writeData(`../data/members/member_${userJoinedinServer.guild.name}_${userJoinedinServer.user.id}.json`, JSON.stringify(usuarioNuevo));
    }

});

/* client.on('messageDelete',function (msg){
    console.log(msg.content)
}) */

client.on('message', async function (msg) {

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
