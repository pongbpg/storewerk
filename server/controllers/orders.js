const _ = require('underscore');
exports.getById = (req, res) => {
    const sql = `select *
    from orders where orderId=? and accountId=?
    order by orderId desc
    `
    req._sql.query(sql, [req.query.orderId, req.query.accountId])
        .then(rows => {
            console.log(rows)
            res.json(rows)
        })
}
exports.getDetailById = (req, res) => {
    const sql = `select *
    from orders_detail where orderId=? and accountId=?
    `
    req._sql.query(sql, [req.query.orderId, req.query.accountId])
        .then(rows => {
            console.log(rows)
            res.json(rows)
        })
}
exports.getByAccountId = (req, res) => {
    const sql = `select o.*
    from orders o
    left join users u on u.userId = ? and u.accountId = o.accountId
    where o.accountId=?  and (o.creator=? or u.roleId IN ('ADMIN','FINANCE'))
    order by o.orderDate desc`
    req._sql.query(sql, [req.query.userId, req.query.accountId, req.query.userId])
        .then(rows => {
            res.json(rows)
        })
}
exports.getOrderNoLatest = (req, res) => {
    req._sql.query(`select LPAD(IFNULL(getOrderNo(?,?),1),4,0) as orderNo`, [req.query.accountId, req.query.orderDate])
        .then(row => {
            res.json(row)
        })
}
exports.created = (req, res) => {
    const keys = Object.keys(req.body.order);
    const sql = `insert into orders(${keys.join(',')}) values ?`;
    console.log(sql, _.values(req.body.order))
    req._sql.query(sql, [_.values(req.body.order)])
        .then(rows => {
            const keys2 = Object.keys(req.body.orderDetail[0]);
            const sql2 = `insert into orders_detail(${keys2.join(',')}) values ${req.body.orderDetail.map(m => '?').join(',')}`;

            req._sql.query(sql2, _.map(req.body.orderDetail, m => _.values(m)))
                .then(rows2 => {
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
        })
        .catch(err => {
            //handle error
            console.log(err);
            res.json({
                inserted: false,
                msg: err.code
            })
        })
}
exports.updated = (req, res) => {
    const keys = Object.keys(_.omit(req.body, 'orderId', 'accountId'));
    let val = [];
    const sql = `update orders
    set ${keys.map(k => {
        val.push(req.body[k])
        return k + '=?'
    })}
    where accountId = ? and  orderId=?
    `;
    val.push(req.body.accountId)
    val.push(req.body.orderId)
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
exports.deleted = (req, res) => {
    // res.json({ deleted: true, orderId: req.params.orderId })
    const sql = `DELETE orders,orders_detail FROM orders
        INNER JOIN
        orders_detail ON orders_detail.orderId = orders.orderId
    WHERE
    orders.orderId = ?;`
    req._sql.query(sql, [req.params.orderId])
        .then(row => {
            res.json({
                deleted: row.affectedRows > 0,
                msg: ''
            })
        })
        .catch(err => {
            //handle error
            console.log(err);
            res.json({
                deleted: false,
                msg: err.code
            })
        })
}