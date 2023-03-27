const user = require("../models/userModel");
const product = require('../models/productmodel');

async function LoginAdmin(username) {
    let User = await user.findOne({ name: username });
    return User;
}

async function allproducts() {
    let Product = await product.find();
    return Product;
}

async function productupdate(id, pname, pdetails, pprice, pquantity) {
    await product.findOneAndUpdate(
        { id: id },
        {
            id: id,
            name: pname,
            details: pdetails,
            price: pprice,
            quantity: pquantity
        })
}

async function productadd(id, pname, pimage, pdetails, pprice, pquantity) {
    console.log(pimage);
    product.insertMany([
        {
            id: id,
            name: pname,
            image: pimage,
            price: pprice,
            details: pdetails,
            quantity: pquantity,
        },
    ]).then(function () {
        console.log("Data inserted")  // Success
    }).catch(function (error) {
        console.log(error)      // Failure
    });
}

async function productdelete(id) {
    await product.findOneAndDelete({ id: id });
}

module.exports = {
    LoginAdmin,
    allproducts,
    productupdate,
    productadd,
    productdelete,
}