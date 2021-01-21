const _ = require('underscore');
exports.request = (req, res) => {
    const sql = `select od.accountId ,o2.orderDate ,o2.orderId,o2.supplierName,o2.customerName,o2.orderTypeId
     ,p.categoryId,IFNULL(c.categoryName,"ไม่มี") as categoryName
    ,p.productId ,od.productName ,p.productImg ,od.quantity ,od.unitName ,o2.created ,o2.creator 
    from orders_detail od 
    inner join orders o2 on o2.orderId =od.orderId and o2.accountId = ?
    left join products p on od.productId = p.productId  and od.categoryId =p.categoryId and p.accountId = od.accountId
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
exports.productUsed = (req, res) => {
    const sql = `SELECT o.orderDate,CONCAT(od.categoryId,'#',od.productId) as productId ,od.productName
    ,sum(if(od.quantity >=0,od.quantity,0)) as debit
    ,sum(if(od.quantity <0,ABS(od.quantity),0)) as credit
    FROM tsstore.orders o
    INNER JOIN tsstore.orders_detail od on o.orderId =od.orderId 
    WHERE o.accountId = ? AND o.warehouseId=? AND o.orderDate >= ? AND o.orderDate <= ?
    AND o.isStatus not in ('REQUESTED','PURCHASED')
    group by o.orderDate,CONCAT(od.categoryId,'#',od.productId),od.productName`
    req._sql.query(sql, [req.body.a, req.body.w, req.body.sd, req.body.ed])
        .then(rows => {
            // console.log(rows)
            res.json(rows)
        })
}
exports.productInit = (req, res) => {
    const sql = `SELECT CONCAT(od.categoryId,'#',od.productId) as productId,sum(od.quantity) as init
    FROM tsstore.orders o
    INNER JOIN tsstore.orders_detail od on o.orderId =od.orderId 
    WHERE o.accountId = ? AND o.warehouseId=? AND o.orderDate < ?
    AND o.isStatus not in ('REQUESTED','PURCHASED')
    group by CONCAT(od.categoryId,'#',od.productId) `
    req._sql.query(sql, [req.body.a, req.body.w, req.body.d])
        .then(rows => {
            // console.log(rows)
            res.json(rows)
        })
}