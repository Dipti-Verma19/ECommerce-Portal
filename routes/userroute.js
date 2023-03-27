const express = require('express');
const ejs = require('ejs');
const app = express()

const loginAuth = require("../middlewares/loginAuth")
const EmailAuth = require("../middlewares/emailAuth")
const usercontroller = require("../controllers/usercontroller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get('/', usercontroller.root)

app.route("/login").get(usercontroller.loginget)
    .post(usercontroller.loginpost)

app.route("/signup").get(usercontroller.signupget)
    .post(usercontroller.signuppost)


app.route("/home").get(loginAuth /*, EmailAuth */, usercontroller.homeget)
    .post(usercontroller.homepost)

app.get("/load", usercontroller.load)

app.get("/verifymail/:token", usercontroller.verifymail)

app.get("/addtocart", usercontroller.addtocart)

app.get("/cart", usercontroller.cart)

app.get("/delete", usercontroller.cartdelete)

app.post("/pluscart", usercontroller.pluscart)

app.post("/minuscart", usercontroller.minuscart)

app.route("/changepass").get(usercontroller.changepassget)
    .post(usercontroller.changepasspost)

//app.get('/forgetpass')

app.get('/logout', usercontroller.logout)

app.get("*", function (req, res) {
    res.send("<h1>404 - Page Not Found</h1>");
})

module.exports = app;