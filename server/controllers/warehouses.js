const _ = require('underscore');
exports.getById = (req, res) => {
    const sql = `select *
    from warehouses where warehouseId=? and accountId=?
    order by warehouseId
    `
    req._sql.query(sql, [req.query.warehouseId, req.query.accountId])
        .then(rows => {
            console.log(rows)
            res.json(rows)
        })
}
exports.getByAccountId = (req, res) => {
    const sql = `select *
    from warehouses 
    where accountId=?  
    order by warehouseId`
    req._sql.query(sql, [req.query.accountId])
        .then(rows => {
            res.json(rows)
        })
}
exports.create = (req, res) => {
    const keys = Object.keys(req.body);
    let sql = `insert into warehouses(${keys.join(',')})`;
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
    const keys = Object.keys(_.omit(req.body, 'warehouseId', 'accountId'));
    let val = [];
    const sql = `update warehouses
    set ${keys.map(k => {
        val.push(req.body[k])
        return k + '=?'
    })}
    where accountId = ? and  warehouseId=?
    `;
    val.push(req.body.accountId)
    val.push(req.body.warehouseId)
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