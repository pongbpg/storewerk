const router = require('express').Router();
const accounts = require('./accounts');
const categories = require('./categories');
const products = require('./products');
const warehouses = require('./warehouses');
const members = require('./members');
const payments = require('./payments');
const orders = require('./orders');
const inventories = require('./inventories');

router.use('/accounts', accounts)
router.use('/categories', categories)
router.use('/products', products)
router.use('/warehouses', warehouses)
router.use('/members', members)
router.use('/payments', payments)
router.use('/orders', orders)
router.use('/inventories', inventories)


module.exports = router