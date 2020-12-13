
const mariadb = require('mariadb');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env.development' });
}
const pool = mariadb.createPool({
    host: 'yaumjai.com',
    user: process.env.MARIADB_USERNAME,
    password: process.env.MARIADB_PASSWORD,
    connectionLimit: 5,
    database: 'tsstore',
    charset: 'UTF8'
});

module.exports = (req, res, next) => {
    pool.getConnection()
        .then(conn => {
            console.log("connected db success! connection id is " + conn.threadId);
            req._sql = conn;
            conn.end(); //release to pool
            next();
        }).catch(err => {
            console.log("not connected due to error: " + err);
        });
}