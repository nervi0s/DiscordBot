const axios = require('axios');

//Get pokemon API data data
async function getDataFromApi(numberPoke) {
    let datos = await axios.get("http://80.211.144.192:9582/api/pokemon/" + numberPoke);
    return datos.data;
}

module.exports = { getDataFromApi }