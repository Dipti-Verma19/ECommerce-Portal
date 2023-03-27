const express = require('express')
const ejs = require('ejs');
const multer = require('multer');
const admin = express()
const upload = multer({ dest: 'uploads/' });

const admincontroller = require("../controllers/admincontroller");

admin.use(express.static("uploads"))
admin.use(express.urlencoded({ extended: true }));
admin.use(express.json());

admin.set("view engine", "ejs");
admin.set('views', "./views/admin")

admin.route("/").get(admincontroller.adminloginget)
    .post(admincontroller.adminloginpost)

admin.get("/home", admincontroller.adminhome)

admin.route("/addproduct").get(admincontroller.addproductget)
    .post(upload.single('pimage'), admincontroller.addproductpost)

admin.get("/delete", admincontroller.productdelete)

admin.post("/update", admincontroller.update)

module.exports = admin;