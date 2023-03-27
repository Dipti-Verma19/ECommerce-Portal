const user = require("../models/userModel");
const product = require('../models/productmodel');

async function finduser(username) {
    let User = await user.findOne({ name: username });
    return User;
}

async function newuser(username, password, email) {
    let User = new user({
        name: username,
        password: password,
        email: email,
        isVerifed: false,
        is_admin: false,
        mailtoken: Date.now(),
    });
    return User;
}

async function allproducts() {
    let Product = await product.find();
    return Product;
}

async function findproduct(id) {
    let products = await product.findOne({ id: id });
    return products;
}

async function userupdate(currentpass, newpass) {
    await user.findOneAndUpdate({ password: currentpass }, { password: newpass });
}

async function findusermail(token) {
    let Users = await user.findOne({ mailtoken: token });
    return Users;
}

async function loadproducts(skip) {
    let products = await product.skip(skip).limit(5);
    return products;
}

module.exports = {
    finduser,
    allproducts,
    userupdate,
    findusermail,
    findproduct,
    newuser,
    loadproducts
}
