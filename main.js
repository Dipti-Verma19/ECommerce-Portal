const express = require('express');
const mongoose = require('mongoose');
const sql = require('mssql');
const session = require('express-session');
const app = express()
const port = 3000

const config = require("./configuation/connectDB");
const pool = new sql.ConnectionPool(config);

pool.connect().then(() => {
  console.log('Connected to SQL database');
}).catch((err) => {
  console.error('Error connecting to database', err);
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))


/*mongoose.connect('mongodb://localhost:27017/Ecommerce', { useNewUrlParser: true })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err));
*/
const sellerroute = require("./routes/sellerroute");
app.use("/seller", sellerroute)

const adminroute = require("./routes/adminroute");
app.use("/admin", adminroute)

const userroute = require("./routes/userroute");
app.use("/", userroute)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

