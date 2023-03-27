const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    user_id: Number,
    name: String, // String is shorthand for {type: String}
    password: String,
    email: String,
    isVerifed: Boolean,
    is_admin: Boolean,
    mailtoken: Date,
    cart: [{
        id: Number,
        name: String,
        image: String,
        price: Number,
        details: String,
        quantity: {
            type: Number,
            default: 1
        },
    }]
});

const user = mongoose.model('user', UserSchema);

module.exports = user