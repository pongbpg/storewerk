const _ = require('underscore');
exports.request = (req, res) => {
    const sql = `select od.accountId ,o2.orderDate ,o2.orderId,o2.supplierName,o2.customerName,o2.orderTypeId
     ,p.categoryId,IFNULL(c.categoryName,"ไม่มี") as categoryName
    ,p.productId ,od.productName ,p.productImg ,od.quantity ,od.unitName ,o2.created ,o2.creator 
    from orders_detail od 
    inner join orders o2 on o2.orderId =od.orderId and o2.accountId = ?
    left join products p on od.productId = p.productId  and od.categoryId =p.categoryId
    left join categories c on c.categoryId = p.categoryId and c.accountId = p.accountId
    where od.orderId in ?
    order by o2.orderDate
    `
    // res.json(req._sql.escape(req.body.orderId))
    req._sql.query(sql, [req.body.a, req.body.o])
        .then(rows => {
            // console.log(rows)
            res.json(rows)
        })
}