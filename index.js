const app = require("./app");
const dotenv = require("dotenv");
const dbconnection = require("./config/dbConnection");

dotenv.config({path:"./config/.env"});

dbconnection()



app.listen(process.env.PORT,()=>{
    console.log(`server is up on ${process.env.PORT}`);
})


