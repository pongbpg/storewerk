const _ = require('underscore');
exports.check = (req, res) => {
    const sql = `call checkPermission(?,?,?,?)`
    req._sql.query(sql, [req.body.a, req.body.u, req.body.p, req.body.an])
        .then(rows => {
            if (rows[0].length > 0) {
                res.json({ result: rows[0][0].result == 'Y' ? true : false })
            } else {
                res.json({ result: false })
            }
            // res.json(rows[0])
        })
}
