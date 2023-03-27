const adminService = require('../services/adminservice')

const adminloginget = (req, res) => {
    res.render("adminlogin", { msg: '' })
}

const adminloginpost = async (req, res) => {
    let { username, password } = req.body;
    let User = await adminService.LoginAdmin(username);
    if (User && User.is_admin) {
        const pass = password === User.password;
        if (pass && User.is_admin) {
            req.session.is_logged_in = true;
            req.session.userName = User.name;
            res.redirect("/admin/home");
        } else {
            res.render("adminlogin", { msg: 'Password did not match!' })
        }
    } else {
        res.render("adminlogin", { msg: 'User cannot Access!!!' })
    }
}

const adminhome = async (req, res) => {
    let products = await adminService.allproducts();
    res.render("adminhome", { user: req.session.userName, product: products });
}

const productdelete = async (req, res) => {
    const { id } = req.query;
    await adminService.productdelete(id);
    res.redirect("/admin/home");
}

const update = async (req, res) => {
    const { id } = req.query;
    let { pname, pdetails, pprice, pquantity } = req.body;
    await adminService.productupdate(id, pname, pdetails, pprice, pquantity);
    res.redirect("/admin/home");
}

const addproductget = async (req, res) => {
    res.render("addproduct", { user: req.session.userName })
}

const addproductpost = async (req, res) => {
    let { pname, pdetails, pprice, pquantity } = req.body;
    let { pimage } = req.file.filename;
    let products = await adminService.allproducts();
    id = products.length + 1;
    await adminService.productadd(id, pname, pdetails, pprice, pquantity, pimage);
    res.redirect("/admin/home")
}

module.exports = {
    adminloginget,
    adminloginpost,
    adminhome,
    productdelete,
    update,
    addproductget,
    addproductpost
}