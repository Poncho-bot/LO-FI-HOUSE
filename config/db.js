const mongoose = require("mongoose");
require('dotenv/config');
var bcrypt = require('bcrypt');

//copia la url del sitio de mongo DB

const MONGOURI = process.env.DB_CONNECTION;

//"mongodb+srv://test:<password>@cluster0.vibox.mongodb.net/<dbname>?retryWrites=true&w=majority";


const InitiateMongoServer = async() => {
    try{
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true
        });
        console.log("Conectado a la BD !!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;