const _ = require('underscore');
exports.request = (req, res) => {
    const sql = `select od.accountId ,o2.orderDate ,o2.orderId ,p.categoryId,p.productId ,p.productName ,p.productImg ,od.quantity ,od.unitName ,o2.created ,o2.creator 
    from orders_detail od 
    inner join orders o2 on o2.orderId =od.orderId and o2.accountId = ?
    left join products p on od.productId = p.productId  and od.categoryId =p.categoryId and p.accountId = ?

    order by o2.orderDate
    `
    // res.json(req.body)
    req._sql.query(sql, [req.body.accountId, req.body.accountId])
        .then(rows => {
            console.log(rows)
            res.json(rows)
        })
}