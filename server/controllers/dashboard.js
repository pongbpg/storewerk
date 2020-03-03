const _ = require('underscore');
exports.rptSaleByMonth = (req, res) => {
    const sql = `call rptSaleByMonth(?,?)`
    req._sql.query(sql, [req.query.year, req.query.month])
        .then(rows => {
            res.json(rows[0])
        })
}