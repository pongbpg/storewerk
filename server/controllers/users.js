const _ = require('underscore');
exports.getById = (req, res) => {
    const sql = `select *
    from users where userId=? and accountId=?
    order by userId
    `
    req._sql.query(sql, [req.query.userId, req.query.accountId])
        .then(rows => {
            // console.log(rows)
            res.json(rows)
        })
}
exports.getByTel = (req, res) => {
    const sql = `call getProfileByTel(?,?,?) `
    req._sql.query(sql, [req.query.userTel, req.query.accountId, req.query.orderTypeId])
        .then(rows => {
            // console.log(rows)
            res.json(rows)
        })
}
exports.getByAccountId = (req, res) => {
    const sql = `select u.*,r.roleName
    from users u
    left join roles r on r.roleId = u.roleId
    where u.accountId=?  
    order by u.userId`
    req._sql.query(sql, [req.query.accountId])
        .then(rows => {
            res.json(rows)
        })
}
exports.create = (req, res) => {
    const keys = Object.keys(req.body);
    let sql = `insert into users(${keys.join(',')})`;
    let val = [];
    let data = [];
    for (let i = 0; i < keys.length; i++) {
        val.push('?');
        data.push(req.body[keys[i]]);
    }
    sql += ` values(${val.join(',')})`
    req._sql.query(sql, data)
        .then(rows => {
            res.json({
                inserted: rows.affectedRows == 1,
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
exports.update = (req, res) => {
    const keys = Object.keys(_.omit(req.body, 'userId', 'accountId'));
    let val = [];
    const sql = `update users
    set ${keys.map(k => {
        val.push(req.body[k])
        return k + '=?'
    })}
    where accountId = ? and  userId=?
    `;
    val.push(req.body.accountId)
    val.push(req.body.userId)
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