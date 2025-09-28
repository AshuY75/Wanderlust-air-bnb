const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const passportLocalMongoose =require('passport-local-mongoose');

const userSchema =new Schema ({
    email:{
        type : String,
        required: true
    }

})
// username and password in model of user is automatically defined by PASSPORT-LOCAL-passportLocalMongoose

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
 