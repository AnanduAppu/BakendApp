const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const validate = require("validator");

const userSchema = mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Please fill your name"],
        minlength: [4, "At least needed four letters"],
        maxlength: [20, "You reached the max character limit"],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Please fill the email"],
        unique: true,
        validate: [validate.isEmail, "Please provide a valid email"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please fill the password"],
        minlength: [4, "Password, at least needs 4 letters"],
        select: false
    },
    cart: Array,
    wishlist: Array,
    orders: Array,
});


userSchema.pre("save",async function (next){

    if (!this.isModified("password")) {
        next()
    }

    this.password = await bycrypt.hash(this.password,10)

});

module.exports = mongoose.model("userData",userSchema)