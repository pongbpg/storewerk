const _ = require('underscore');
exports.getById = (req, res) => {
    const sql = `select a.* from accounts a
    left join users b on a.accountId = b.accountId
    where b.accountId=? and b.userId=? 
    order by a.registerDate
    `
    req._sql.query(sql, [req.query.id, req.query.email])
        .then(rows => {
            res.json(rows)
        })
}
exports.getByUser = (req, res) => {
    const sql = `select a.* from accounts a
    left join users b on a.accountId = b.accountId
    where b.userId = ?
    order by a.registerDate
    `
    req._sql.query(sql, [req.query.email])
        .then(rows => {
            res.json(rows)
        })
}
exports.createAccount = (req, res) => {
    // console.log('before query', req.body.accountId)
    // const sql = `select * from accounts where accountId = ?`
    // req._sql.query(sql, [req.body.accountId])
    //     .then(rows => {
    //         if (rows.length > 0) {
    //             res.json({
    //                 inserted: false, message: 'This account already exists!'
    //             })
    //         } else {
    const keys = Object.keys(req.body);
    let sql2 = `insert into accounts (${keys.join(',')})`;
    let val = [];
    let data = [];
    for (let i = 0; i < keys.length; i++) {
        val.push('?');
        data.push(req.body[keys[i]]);
    }
    sql2 += ` values(${val.join(',')})`
    req._sql.query(sql2, data)
        .then(rows2 => {
            // console.log('inserted', rows2)
            if (rows2.affectedRows == 1) {
                req._sql.query(`insert into users (accountId,userId) values(?,?)`, [req.body.accountId, req.body.creator])
            }
            res.json({
                inserted: rows2.affectedRows == 1,
                msg: ''
            })
        })
        .catch(err => {
            //handle error
            console.log(err);
            res.json({
                inserted: false,
                msg: err.code
            })
        })
    // }
    // })
}
exports.updateAccount = (req, res) => {
    const keys = Object.keys(_.omit(req.body, 'accountId'));
    let val = [];
    const sql = `update accounts
    set ${keys.map(k => {
        val.push(req.body[k])
        return k + '=?'
    })}
    where accountId = ?
    `;
    val.push(req.body.accountId)
    req._sql.query(sql, val)
        .then(row => {
            res.json({
                updated: row.affectedRows == 1,
                msg: ''
            })
        })
        .catch(err => {
            //handle error
            console.log(err);
            res.json({
                updated: false,
                msg: err.code
            })
        })
}