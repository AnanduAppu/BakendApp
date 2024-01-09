const express = require("express");
const app = express();
const cookies = require("cookie-parser");
const errorHandler = require("./middleWares/errorhandler")

app.use(cookies());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//registartion
const routeSingUp = require("./routes/signUp");
app.use("/user/",routeSingUp);


// login and authorization
const userRouter = require("./routes/userlog");
app.use("/user/",userRouter)


//admin login and authorization
const adminRouter = require("./routes/adminIn");
app.use("/user/",adminRouter)

//error handler
app.use(errorHandler)


module.exports = app;