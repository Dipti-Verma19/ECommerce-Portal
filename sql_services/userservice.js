const sql = require('mssql');
const config = require("../configuation/connectDB");

sql.on('error', err => {
    console.log(err.message)
})

async function finduser(username) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`SELECT * FROM users where name = '${username}'`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function newuser(username, password, email) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`INSERT INTO users (name, pass, email, isVerfied, isadmin) VALUES('${username}', '${password}', '${email}', 0, 0)`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function allproducts() {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query('select * from products');
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function findproduct(id) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`select * from products where prodID ='${id}'`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function userupdate(currentpass, newpass) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`update users set pass='${newpass}' where pass='${currentpass}'`);
        console.log(result);
        sql.close();
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function findusermail(token) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`SELECT * FROM users where mailtoken = '${token}'`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
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
