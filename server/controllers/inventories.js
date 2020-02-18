const _ = require('underscore');
exports.getByWarehouseId = (req, res) => {
    const sql = `select *
    from orders where warehouseId=? and accountId=?
    order by warehouseId
    `
    req._sql.query(sql, [req.query.warehouseId, req.query.accountId])
        .then(rows => {
            console.log(rows)
            res.json(rows)
        })
}
exports.getByAccountId = (req, res) => {
    const sql = `call getInventoryByAccId(?)`
    req._sql.query(sql, [req.query.accountId])
        .then(rows => {
            res.json(rows)
        })
}