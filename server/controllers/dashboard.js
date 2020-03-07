const _ = require('underscore');
exports.rptSaleByMonth = (req, res) => {
    const sql = `call rptSaleByMonth(?,?,?)`
    req._sql.query(sql, [req.query.year, req.query.month, req.query.accountId])
        .then(rows => {
            res.json(rows[0])
        })
}
exports.rptProductByMonth = (req, res) => {
    const sql = `call rptProductByMonth(?,?,?)`
    req._sql.query(sql, [req.query.year, req.query.month, req.query.accountId])
        .then(rows => {
            res.json(rows[0])
        })
}