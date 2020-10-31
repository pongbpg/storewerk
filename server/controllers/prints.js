const _ = require('underscore');
exports.request = (req, res) => {
    const sql = `select *
    from payments where paymentId=? and accountId=?
    order by paymentId
    `
    req._sql.query(sql, [req.query.paymentId, req.query.accountId])
        .then(rows => {
            console.log(rows)
            res.json(rows)
        })
}