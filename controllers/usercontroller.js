const sendmail = require("../methods/sendmail");
const forget = require("../methods/forgetpass")
const userService = require('../sql_services/userservice');
const cartService = require('../sql_services/cartservice');


const root = (req, res) => {
    res.render("root");
}

const loginget = function (req, res) {
    res.render("login", { success: '' })
}
const loginpost = async function (req, res) {
    let { username, password } = req.body;
    let User = await userService.finduser(username);
    if (User) {
        const pass = password === User[0].password;
        if (pass) {
            req.session.is_logged_in = true;
            req.session.userName = User[0].name;
            req.session.userid = User[0].id;
            req.session.count = 1;
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
        await userService.newuser(username, password, email);
        let User = await userService.finduser(username);
        sendmail(email, User[0].mailtoken, function (err, data) {
            req.session.is_logged_in = false;
            res.redirect("/login");
        })
    }
}

const homeget = async function (req, res) {
    let products = await userService.load5products(0);
    res.render("home", { user: req.session.userName, product: products.recordset, count: products.rowsAffected });
}

const load = async (req, res) => {
    let c = parseInt(req.session.count) + 1;
    req.session.count = req.session.count + 1;
    const offset = (c - 1) * 5;
    let products = await userService.load5products(offset);
    if (products.rowsAffected > 0)
        res.render("home", { user: req.session.userName, product: products.recordset, count: products.rowsAffected, msg: "No More Products." });
    else {
        req.session.count = 1;
        res.render("home", { user: req.session.userName, product: products.recordset, count: products.rowsAffected, msg: "No More Products." });
    }

}

const cart = async (req, res) => {
    let cart = await cartService.showcart(parseInt(req.session.userid));
    res.render("cart", { user: req.session.userName, cart: /*User.cart*/ cart, msg: "NO products are added to the cart " })

}

const addtocart = async (req, res) => {
    const { id } = req.query;
    //let addproduct = await userService.findproduct(id);
    await cartService.addtocart(parseInt(req.session.userid), id);
    /*if (User.cart.length > 0) {
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
    */
    if (req.session.count > 1)
        res.redirect("/load");
    else
        res.redirect("/home");
}

const cartdelete = async (req, res) => {
    const { id } = req.query;
    let User = await userService.finduser(req.session.userName);
    let userid = User[0].id;
    await cartService.deletecart(userid, id);
    /*
    for (let i = 0; i < User.cart.length; i++) {
        if (User.cart[i].id == id) {
            User.cart.splice(i, 1)
        }
    }
    User.save();
    */
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
    if (User[0].is_admin)
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
    /*for (let i = 0; i < User.cart.length; i++) {
        if (User.cart[i].id == id) {
            User.cart[i].quantity--;
            return;
        }
    }
    
    User.save();
    */
    let userid = User[0].id;
    await cartService.minusquantity(userid, id);
    res.redirect("/cart");
}

const pluscart = async (req, res) => {
    const { id } = req.body;
    console.log(id)
    let User = await userService.finduser(req.session.userName);
    let userid = User[0].id;
    /*for (let i = 0; i < User.cart.length; i++) {
        if (User.cart[i].id == id) {
            User.cart[i].quantity++;
            return;
        }
    }
    User.save();
    */
    await cartService.plusquantity(userid, id);
    res.redirect("/cart");
}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

const orderpage = async (req, res) => {
    let order = await cartService.getmyorders(parseInt(req.session.userid));
    res.render("myorders", { user: req.session.userName, order: order })
}

const orderget = (req, res) => {
    const { total } = req.query;
    req.session.amount = total;
    res.render("order", { user: req.session.userName });
}
const orderpost = async (req, res) => {
    req.session.address = req.body;
    //console.log(req.session.address);
    res.render("payment", { amount: req.session.amount });
}

const payment = (req, res) => {
    const RazorPay = require('razorpay');
    const razorpay = new RazorPay({
        key_id: 'rzp_test_ChPmU5xEZJWFc5',
        key_secret: '5wBPBQJW89hQKrhn3T0DhIGR',
    })
    let options = {
        amount: req.session.amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    };
    razorpay.orders.create(options, (err, order) => {
        console.log(order)
        console.log("this is order id -" + order.id)
        res.send({ oid: order.id });
    })
}

const paymentdone = async (req, res) => {
    let { house_no, area, state, zip } = req.session.address;
    let wholecart = await cartService.selectcart(parseInt(req.session.userid));
    let userid = parseInt(req.session.userid);
    for (let i = 0; i < wholecart.length; i++) {
        await cartService.placeorderandreducestock(userid, wholecart[i].prodID, wholecart[i].quantity, house_no, area, state, zip);
    }
    res.render("paymentdone");
}

const forgetpassget = (req, res) => {
    res.render("forpass", { err: '' });
}

const forgetpasspost = async (req, res) => {
    let { username, email } = req.body;
    let User = await userService.finduser(username);
    if (User) {
        const check = email === User[0].email;
        if (check) {
            forget(User[0].email, User[0].password, function (err, data) {
                console.log(err, data)
            });
            res.render("forpass", { err: "Mail has been send to your registered email. Kindly Login with your password" })
        } else {
            res.render("forpass", { err: "Email did not match!" })
        }
    } else {
        res.render("forpass", { err: "User do not have a account , please signup!!!" })
    }
}
module.exports = {
    root,
    loginget,
    loginpost,
    signupget,
    signuppost,
    homeget,
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
    orderget,
    orderpost,
    orderpage,
    forgetpassget,
    forgetpasspost,
    payment,
    paymentdone,
}