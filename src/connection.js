require('dotenv').config();

const mongoose = require('mongoose');
const uri = process.env.MONGO_DB;


(async function () {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (err) {
        console.log(err)
        console.log("No se ha podido conectar a la DB");
    }
})();

mongoose.connection.on('open', function () {
    console.log("Conexión  a la DB establecida!")
});

mongoose.connection.on('disconnected', () => {
    console.log("Se ha perdido la conexión con la DB")
});