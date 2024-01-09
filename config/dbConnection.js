const mongoose = require("mongoose");

const dbconnection = ()=>{

    mongoose.connect(process.env.DB_URI)
        .then((data)=>console.log(`connected to server ${data.connection.host}`))
        .catch((err)=>console.log(`error figure at ${err}`))
};

module.exports = dbconnection
