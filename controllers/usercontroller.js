const sendmail = require("../methods/sendmail");
const userService = require('../services/userservice');

const root = (req, res) => {
    res.render("root");
}

const loginget = function (req, res) {
    res.render("login", { success: '' })
}
const loginpost = async function (req, res) {
    let { username, password } = req.body;
    let User = await userService.finduser(username);
    console.log(User)
    if (User) {
        const pass = password === User.password;
        if (pass) {
            req.session.is_logged_in = true;
            req.session.userName = User.name;
            console.log(req.session.userName);
            req.session.count = 0;
            res.redirect("/home");
        } else {
            res.render("login", { success: "Password did not match!" })
        }
    } else {
        res.render("login", { success: "User do not have a account , please signup!!!" })
    }
}

const signupget = function (req, res) {
    res.render("signup", { err: "" })
}

const signuppost = async function (req, res) {
    let { username, password, email } = req.body;
    let User = await userService.finduser(username);
    if (User.length) {
        res.render("signup", { err: "That user already exisits!" })
    } else {
        // Insert the new user if they do not exist yet
        let User = await userService.newuser(username, password, email);

        sendmail(email, User[0].mailtoken, function (err, data) {
            req.session.is_logged_in = false;
            req.session.user = User;
            req.session.id = id;
            res.redirect("/login");
        })
    }
}

const homeget = async function (req, res) {
    let products = await userService.allproducts();
    res.render("home", { user: req.session.userName, product: products, count: req.session.count });
}

const homepost = async (req, res) => {

    let page = parseInt(req.query);
    page += 1;
    let skip = (page - 1) * 5;
    console.log(page)
    console.log(skip)
    let products = await userService.loadproducts(skip);
    res.render("home", { user: req.session.userName, product: products, count: req.session.count });
}

const load = async (req, res) => {
    let products = await userService.allproducts();
    req.session.count = req.session.count + 5;
    if (req.session.count < products.length) {
        res.render("home", { user: req.session.userName, product: products, count: req.session.count });
    }
    else if (req.session.count >= products.length) {
        req.session.count = 0;
        res.send("<h1>NO MORE Products <br></br> Go to frist Page <a href='/home'>Home</a></h1>")
    }
}

const cart = async (req, res) => {
    let User = await userService.finduser(req.session.userName);
    res.render("cart", { user: req.session.userName, cart: User.cart, msg: "NO products are added to the cart " })
}

const addtocart = async (req, res) => {
    const { id } = req.query;
    let addproduct = await userService.findproduct(id);
    let User = await userService.finduser(req.session.userName);
    if (User.cart.length > 0) {
        for (let i in User.cart) {
            if (User.cart[i].id == id) {
                User.cart[i].quantity++;
                return;
            }
        }
        User.cart[User.cart.length] = {
            id: id,
            name: addproduct.name,
            image: addproduct.image,
            price: addproduct.price,
            details: addproduct.details,
            quantity: 1
        }
    } else {
        User.cart[User.cart.length] = {
            id: id,
            name: addproduct.name,
            image: addproduct.image,
            price: addproduct.price,
            details: addproduct.details,
            quantity: 1
        }
    }
    User.save();
    res.redirect("/home");
}

const cartdelete = async (req, res) => {
    const { id } = req.query;
    let User = await userService.finduser(req.session.userName);
    for (let i = 0; i < User.cart.length; i++) {
        if (User.cart[i].id == id) {
            User.cart.splice(i, 1)
        }
    }
    User.save();
    res.redirect("/cart");
}

const changepassget = (req, res) => {
    res.render("changepass", { msg: '' });
}

const changepasspost = async (req, res) => {
    let { currentpass, newpass, confirmpass } = req.body;

    let User = await userService.finduser(req.session.userName);
    if (User[0].pass == currentpass) {
        if (newpass == confirmpass) {
            await userService.userupdate(currentpass, newpass);
        }
        else {
            res.render("changepass", { msg: 'New Password and Confirm Password did not match!' });
        }
    }
    else {
        res.render("changepass", { msg: 'Invalid Current Password!' });
    }
    if (User.is_admin)
        res.redirect("/admin/home")
    else
        res.redirect("/home");
}

const verifymail = async (req, res) => {
    const { token } = req.params;
    let User = await userService.findusermail(token);
    if (User) {
        User.isVerifed = true;
        req.session.isVerify = true;
        res.redirect("/home");
    }
    else {
        req.session.isVerify = false;
        res.redirect("/home");
    }
}

const minuscart = async (req, res) => {
    const { id } = req.body;
    console.log(id)
    let User = await userService.finduser(req.session.userName);
    for (let i = 0; i < User.cart.length; i++) {
        if (User.cart[i].id == id) {
            User.cart[i].quantity--;
            return;
        }
    }
    User.save();
    res.end();
}

const pluscart = async (req, res) => {
    const { id } = req.body;
    console.log(id)
    let User = await userService.finduser(req.session.userName);
    for (let i = 0; i < User.cart.length; i++) {
        if (User.cart[i].id == id) {
            User.cart[i].quantity++;
            return;
        }
    }
    User.save();
    res.end();
}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

module.exports = {
    root,
    loginget,
    loginpost,
    signupget,
    signuppost,
    homeget,
    homepost,
    cart,
    cartdelete,
    changepassget,
    changepasspost,
    addtocart,
    logout,
    minuscart,
    pluscart,
    verifymail,
    load,
}