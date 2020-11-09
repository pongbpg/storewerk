const _ = require('underscore');
exports.getById = (req, res) => {
    const sql = `select ap.* ,IFNULL(ac.categoryName,"ไม่มี") as categoryName
    from products ap
    left join categories ac on ac.accountId = ap.accountId and ac.categoryId = ap.categoryId
    where ap.productId = ? and ap.accountId =? 
    order by categoryId,productId
    `
    req._sql.query(sql, [req.query.productId, req.query.accountId])
        .then(rows => {
            console.log(rows)
            res.json(rows)
        })
}
exports.getByAccountId = (req, res) => {
    const sql = `select ap.* ,IFNULL(ac.categoryName,"ไม่มี") as categoryName
    from products ap
    left join categories ac on ac.accountId = ap.accountId and ac.categoryId = ap.categoryId
    where ap.accountId=?  order by categoryId,productId`
    req._sql.query(sql, [req.query.accountId])
        .then(rows => {
            res.json(rows)
        })
}
exports.create = (req, res) => {
    const keys = Object.keys(req.body);
    let sql = `insert into products(${keys.join(',')})`;
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
    const keys = Object.keys(_.omit(req.body,'accountId'));
    let val = [];
    const sql = `update products
    set ${keys.map(k => {
        val.push(req.body[k])
        return k + '=?'
    })}
    where accountId = ? and productId =? and categoryId =?
    `;
    val.push(req.body.accountId)
    val.push(req.body.productId)
    val.push(req.body.categoryId)
    // res.json({ sql, val })
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
                msg: JSON.stringify(err)
            })
        })
}