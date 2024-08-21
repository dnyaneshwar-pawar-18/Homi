const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

/*

The passport-local-mongoose plugin is designed to simplify user authentication with 
Passport.js using a local strategy (i.e., username and password).

Automatic Fields: When you add this plugin to your schema, it automatically adds username and hash (for storing the hashed password) fields to your schema. 
You don't need to define them manually because the plugin handles them internally.

*/