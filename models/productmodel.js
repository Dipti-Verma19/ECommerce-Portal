const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
    id: Number,
    name: String,
    image: String,
    price: Number,
    details: String,
    quantity: Number,

});

const product = mongoose.model('Product', ProductSchema);
module.exports = product;