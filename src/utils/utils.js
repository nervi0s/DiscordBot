const axios = require('axios');
const util = require('util');
const fs = require('fs');

const readDirPromise = util.promisify(fs.readdir);
const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

//Read file's names from directory
async function readDir(path) {
    let namesData = [];
    try {
        namesData = await readDirPromise(path, "utf8");

    } catch (err) {
        console.log(err);
    }
    return namesData;
}

//Write user data to files
async function writeData(path, data) {
    try {
        await writeFilePromise(path, data);
        console.log("Archivo con nuevo usuario creado")
    } catch (err) {
        console.log(err);
    }
}

//Determines if a user has previously logged in to the server
async function isOldMember(arrayFilesNames, idUser) {
    for (let i = 0; i < arrayFilesNames.length; i++) {
        try {
            let dataFromFile = await readFilePromise(`../data/members/members/${arrayFilesNames[i]}`, "utf8");
            //console.log(JSON.parse(dataFromFile))
            if (idUser == JSON.parse(dataFromFile).id) {
                return true;
            }
        } catch (err) {
            console.log(err);
        }
    }
    return false;
}

//Get pokemon API data data
async function getDataFromApi(numberPoke) {
    let datos = await axios.get("http://80.211.144.192:9582/api/pokemon/" + numberPoke);
    return datos.data;
}



module.exports = { isOldMember, getDataFromApi, readDir, writeData }
